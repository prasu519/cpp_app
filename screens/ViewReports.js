import { View, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import axios from "axios";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";
import { Text, Divider, ListItem } from "@rneui/themed";

export default function ViewReports({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");

  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();
  const [blend, setBlend] = useState();
  const [coalTowerStock, setCoalTowerStock] = useState();
  const [mbTopStock, setMbTopStock] = useState();
  const [runningHours, setRunningHours] = useState();
  const [shiftDelays, setShiftDelays] = useState();
  const [coalAnalysisData, setCoalAnalysisData] = useState();
  const [pushingSchedule, setPushingSchedule] = useState();

  const [coalCount, setCoalCount] = useState(0);
  const [blendCount, setBlendCount] = useState(0);
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
    //let date = day + "/" + month + "/" + year;
    let date = selectedDate.toISOString().split("T")[0];
    if (selectedShift === "" || selectedShift === "Select") {
      alert("Select Shift..");
      return;
    }
    let shift = selectedShift;
    getBlend(date, shift);
    getReclaimingData(date, shift);
    getfeedingdata(date, shift);
    getCoalTowerStock(date, shift);
    getMbTopCoalData(date, shift);
    getRunningHoursdata(date, shift);
    getShiftDelayData(date, shift);
    getCoalAnalysisData(date, shift);
    getPushingScheduleData(date, shift);

    setLoadCard(true);
  };

  const getBlend = async (date, shift) => {
    await axios
      .get(BaseUrl + "/blend", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((response) => {
        setBlend(response.data.data[0]);
        setBlendCount(response.data.data[0].total);
      })
      .catch((error) => console.log(error));
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

  const getCoalTowerStock = async (date, shift) => {
    await axios
      .get(BaseUrl + "/coaltowerstock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setCoalTowerStock(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getMbTopCoalData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/mbtopStock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setMbTopStock(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getRunningHoursdata = async (date, shift) => {
    await axios
      .get(BaseUrl + "/runningHours", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setRunningHours(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getShiftDelayData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/shiftDelay", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setShiftDelays(responce.data.data))
      .catch((error) => console.log(error));
  };

  const getCoalAnalysisData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/coalAnalysis", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setCoalAnalysisData(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getPushingScheduleData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/pushings", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setPushingSchedule(responce.data.data[0]))
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
          gap: 20,
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
            {selectedDate.toISOString().split("T")[0]}
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
            marginLeft: 20,
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
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Reclaiming
              </Card.Title>
              <Card.Divider />
              {reclaiming && mbTopStock && coalCount > 0 && (
                <View>
                  {Array.from({ length: coalCount }, (_, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>
                        {reclaiming[
                          "coal" + (index + 1) + "name"
                        ].toUpperCase()}
                      </Text>
                      <Divider orientation="vertical" />
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
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {reclaiming[item + "recl"] === 0
                          ? "000"
                          : reclaiming[item + "recl"]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4 h4Style={{ marginTop: 20 }}>
                        Total Reclaiming
                      </Text>
                      <Text h4 h4Style={{ marginTop: 20 }}>
                        {reclaiming["total_reclaiming"]}
                      </Text>
                    </View>
                    <Card.Divider />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h3 h3Style={{ marginTop: 20, color: "red" }}>
                        Total Stock
                      </Text>
                      <Text h3 h3Style={{ marginTop: 20, color: "red" }}>
                        {mbTopStock["total_stock"]}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>

            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Feeding
              </Card.Title>
              <Card.Divider />
              {feeding && coalTowerStock && (
                <View style={{ marginTop: 10 }}>
                  {["ct1", "ct2", "ct3"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {feeding[item] === 0 ? "000" : feeding[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  {["stream1", "stream1A"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {feeding[item] === 0 ? "0000" : feeding[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4 h4Style={{ marginTop: 20 }}>
                        Total Feeding
                      </Text>
                      <Text h4 h4Style={{ marginTop: 20 }}>
                        {feeding["total_feeding"]}
                      </Text>
                    </View>
                    <Card.Divider />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h3 h3Style={{ marginTop: 20, color: "red" }}>
                        Total Stock
                      </Text>
                      <Text h3 h3Style={{ marginTop: 20, color: "red" }}>
                        {coalTowerStock["total_stock"]}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Card>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Running Hours
              </Card.Title>
              <Card.Divider />
              {runningHours && (
                <View style={{ marginTop: 10 }}>
                  {[2, 3, 4].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>Stream-{item}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {runningHours["str" + item + "hrs"]}:
                        {runningHours["str" + item + "min"]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  {[49, 50, 126].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>CC-{item}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {runningHours["cc" + item + "hrs"]}:
                        {runningHours["cc" + item + "min"]}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Shift Delays
              </Card.Title>
              <Card.Divider />
              {shiftDelays && (
                <View style={{ marginTop: 10 }}>
                  {shiftDelays.map((item, index) => (
                    <View key={index}>
                      <View
                        style={{
                          alignSelf: "center",
                          marginBottom: 20,
                        }}
                      >
                        <Text h4 h4Style={{ textDecorationLine: "underline" }}>
                          Delay - {item.delayNumber}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Text h4>From :</Text>
                        <Text h4 h4Style={{ marginRight: 10 }}>
                          {item.fromTime}
                        </Text>

                        <Text h4>To :</Text>
                        <Text h4>{item.toTime}</Text>
                      </View>
                      <View
                        style={{
                          marginTop: 20,
                          marginLeft: 10,
                        }}
                      >
                        <Text h4 h4Style={{ marginBottom: 10 }}>
                          <Text
                            style={{
                              textDecorationLine: "underline",
                              color: "green",
                            }}
                          >
                            Reason
                          </Text>
                          : {item.reason}
                        </Text>
                      </View>
                      <Card.Divider />
                    </View>
                  ))}
                </View>
              )}
            </Card>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Coal Analysis
              </Card.Title>
              <Card.Divider />
              {coalAnalysisData && (
                <View style={{ marginTop: 10 }}>
                  {["ci", "ash", "vm", "fc", "tm"].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{item.toUpperCase()}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>
                        {item === "ci"
                          ? coalAnalysisData[item] + "%"
                          : coalAnalysisData[item]}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Pushing Schedule
              </Card.Title>
              <Card.Divider />
              {pushingSchedule && (
                <View style={{ marginTop: 10 }}>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>Battery-{item}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>{pushingSchedule["bat" + item]}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Blend
              </Card.Title>
              <Card.Divider />
              {blend && blendCount > 0 && (
                <View style={{ marginTop: 10 }}>
                  {Array.from({ length: blendCount }, (_, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text h4>{blend["cn" + (index + 1)]}</Text>
                      <Divider orientation="vertical" />
                      <Text h4>{blend["cp" + (index + 1)]}%</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
