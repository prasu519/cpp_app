import { View, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import axios from "axios";
import { Text, Divider } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FormatDate } from "../utils/FormatDate";

export default function BlendReportView({ navigation }) {
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [blendData, setBlendData] = useState({});
  const [excludedKeys, setExcludedKeys] = useState([
    "__v",
    "_id",
    "date",
    "shift",
    "empnum",
    "total",
  ]);

  const handleFromDateChange = (event, date) => {
    setShowFromDatePicker(false);
    if (date) {
      setSelectedFromDate(date);
    }
  };
  const handleToDateChange = (event, date) => {
    setShowToDatePicker(false);
    if (date) {
      setSelectedToDate(date);
    }
  };

  const getBlendDataDatewise = async (fromDate, toDate) => {
    try {
      const response = await axios.get(BaseUrl + "/blend/datewise", {
        params: {
          fromdate: fromDate,
          todate: toDate,
        },
      });
      setBlendData(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch data. Please check the date and try again."
      );
    }
  };

  const handleSubmit = async () => {
    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];

    await getBlendDataDatewise(fromDate, toDate);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: hp(15),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View
          style={{
            paddingTop: hp(5),
            paddingLeft: hp(2),
            flexDirection: "row",
            alignItems: "center",
            gap: wp(12),
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
              fontSize: wp(6),
              borderBottomWidth: 2,
              color: "black",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Blend Report View
          </Text>
        </View>
      </View>
      <View
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: hp(15),
          padding: hp(2),
          gap: wp(2),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: wp(2),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: hp(10),
            width: wp(80),
            backgroundColor: "lightgrey",
            borderRadius: 25,
          }}
        >
          <Button
            title="From Date"
            buttonStyle={{ width: wp(40), height: hp(5) }}
            titleStyle={{
              fontSize: hp(2),
              color: "white",
              borderBottomWidth: 2,
              borderBottomColor: "white",
            }}
            radius={25}
            onPress={() => setShowFromDatePicker(true)}
          />
          {showFromDatePicker && (
            <DateTimePicker
              value={selectedFromDate}
              mode="date"
              display="spinner"
              onChange={handleFromDateChange}
            />
          )}
          <Text style={{ fontSize: hp(2.5), color: "green" }}>
            {FormatDate(selectedFromDate)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: wp(2),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: hp(10),
            width: wp(80),
            backgroundColor: "lightgrey",
            borderRadius: 25,
          }}
        >
          <Button
            title="To Date"
            buttonStyle={{ width: wp(40), height: hp(5) }}
            titleStyle={{
              fontSize: hp(2),
              color: "white",
              borderBottomWidth: 2,
              borderBottomColor: "white",
            }}
            radius={25}
            onPress={() => setShowToDatePicker(true)}
          />
          {showToDatePicker && (
            <DateTimePicker
              value={selectedToDate}
              mode="date"
              display="spinner"
              onChange={handleToDateChange}
            />
          )}
          <Text style={{ fontSize: hp(2.5), color: "green" }}>
            {FormatDate(selectedToDate)}
          </Text>
        </View>

        <Button
          title={"Submit"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            alignSelf: "center",
          }}
          radius={20}
          titleStyle={{
            textDecorationLine: "underline",
            fontSize: hp(2),
            fontWeight: "600",
          }}
          onPress={handleSubmit}
        />
      </View>
      <ScrollView>
        {blendData !== undefined &&
          Array.from({ length: blendData.length }, (_, index) => (
            <Card key={index}>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                {"Blend - " + (index + 1)}
              </Card.Title>
              <Card.Divider />
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: wp(10),
                  gap: hp(3),
                }}
              >
                <View
                  style={{
                    width: wp(30),
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    Start Date
                  </Text>
                </View>
                <Divider orientation="vertical" />
                <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                  {blendData[index]["date"].split("T", 1)}
                </Text>
              </View>
              <View
                key={index + 1}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: wp(10),
                  gap: hp(3),
                }}
              >
                <View
                  style={{
                    width: wp(30),
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    Shift
                  </Text>
                </View>
                <Divider orientation="vertical" />
                <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                  {blendData[index]["shift"].split("T", 1)}
                </Text>
              </View>
              <Card.Divider />

              {blendData[index] &&
                Object.keys(blendData[index])
                  .filter(
                    (key) =>
                      !excludedKeys.includes(key) && !key.startsWith("cp")
                  )
                  .map((ikey, inindex) => {
                    return (
                      <View
                        key={inindex}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(10),
                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(30),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {blendData[index]["cn" + (inindex + 1)]}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                          {blendData[index]["cp" + (inindex + 1)] + "%"}
                        </Text>
                      </View>
                    );
                  })}
            </Card>
          ))}
      </ScrollView>
    </View>
  );
}
