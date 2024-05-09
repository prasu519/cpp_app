import { View, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, Card } from "@rneui/base";
import axios from "axios";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";

export default function ViewReports({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");

  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();

  const [coalCount, setCoalCount] = useState(0);
  const [loadCard, setLoadCard] = useState(false);

  useEffect(() => {
    if (reclaiming) {
      let count = 0;
      for (let i = 1; i <= 8; i++) {
        if (reclaiming["coal" + i + "name"] != null) {
          count++;
        }
      }
      setCoalCount(count);
    }
  }, [reclaiming]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = () => {
    let day = selectedDate.getDate();
    let month = selectedDate.getMonth() + 1;
    let year = selectedDate.getFullYear();
    let date = day + "/" + month + "/" + year;
    if (selectedShift === "" || selectedShift === "Select") {
      alert("Select Shift..");
      return;
    }
    let shift = selectedShift;
    getReclaimingData(date, shift);
    getfeedingdata(date, shift);

    setLoadCard(true);
  };

  const getReclaimingData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/reclaiming", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setReclaiming(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getfeedingdata = async (date, shift) => {
    await axios
      .get(BaseUrl + "/feeding", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setFeeding(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 40,
          paddingLeft: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 40,
        }}
      >
        <AntDesign
          name="leftcircle"
          size={40}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontSize: 30,
            textDecorationLine: "underline",
            color: "red",
            alignSelf: "center",
            fontWeight: "bold",
            marginLeft: 25,
          }}
        >
          View Reports
        </Text>
      </View>
      <View style={{ marginTop: 30, gap: 10, marginLeft: 10 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            width: "90%",
          }}
        >
          <Button
            title="Select date"
            buttonStyle={{ width: 150, height: 50 }}
            titleStyle={{
              fontSize: 20,
              color: "white",
              textDecorationLine: "underline",
            }}
            radius={25}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
          <Text style={{ fontSize: 30 }}>
            {selectedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            width: "90%",
          }}
        >
          <View
            style={{
              height: 50,
              width: 150,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#6495ED",
              borderRadius: 25,
            }}
          >
            <Text
              style={{
                fontSize: 21,
                marginLeft: 5,
                fontWeight: "500",
                color: "white",
              }}
            >
              Select Shift
            </Text>
          </View>
          <Picker
            id="Shift"
            style={{
              width: 150,
            }}
            mode="dropdown"
            enabled={true}
            onValueChange={(shift) => setSelectedShift(shift)}
            selectedValue={selectedShift}
          >
            {["Select", "A", "B", "C"].map((shift) => (
              <Picker.Item
                key={shift}
                label={shift.toString()}
                value={shift}
                style={{ fontSize: 25 }}
              />
            ))}
          </Picker>
        </View>
        <Button
          title={"Submit"}
          color={"#000080"}
          buttonStyle={{
            height: 50,
            width: 300,
            marginLeft: 50,
            marginTop: 30,
          }}
          radius={20}
          titleStyle={{
            textDecorationLine: "underline",
            fontSize: 25,
            fontWeight: "600",
          }}
          onPress={handleSubmit}
        />
      </View>
      <ScrollView>
        {loadCard && (
          <View style={{ marginTop: 20 }}>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Reclaiming
              </Card.Title>
              <Card.Divider />
              {reclaiming && coalCount > 0 && (
                <View>
                  {Array.from({ length: coalCount }, (_, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>
                        {reclaiming[
                          "coal" + (index + 1) + "name"
                        ].toUpperCase()}
                      </Text>
                      <Text h4>
                        {reclaiming["coal" + (index + 1) + "recl"] === "0"
                          ? "000"
                          : reclaiming["coal" + (index + 1) + "recl"]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  {["cc49", "cc50", "cc126"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Text h4>
                        {reclaiming[item + "recl"] === "0"
                          ? "000"
                          : reclaiming[item + "recl"]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Text h3 h3Style={{ marginTop: 20 }}>
                      Total Reclaiming
                    </Text>
                    <Text h3 h3Style={{ marginTop: 20 }}>
                      {reclaiming["total_reclaiming"]}
                    </Text>
                  </View>
                </View>
              )}
            </Card>

            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Feeding
              </Card.Title>
              <Card.Divider />
              {feeding && (
                <View style={{ marginTop: 10 }}>
                  {["ct1", "ct2", "ct3"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Text h4>
                        {feeding[item] === "0" ? "000" : feeding[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  {["stream1", "stream1A"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Text h4>
                        {feeding[item] === "0" ? "000" : feeding[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Text h3 h3Style={{ marginTop: 20 }}>
                      Total Feeding
                    </Text>
                    <Text h3 h3Style={{ marginTop: 20 }}>
                      {feeding["total_feeding"]}
                    </Text>
                  </View>
                </View>
              )}
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
