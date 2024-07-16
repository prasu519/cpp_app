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
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { FormatDate } from "../utils/FormatDate";

export default function DayReportView({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadCard, setLoadCard] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [mergedReclaimingData, setMergedReclaimingData] = useState({});
  const [mergedFeedingData, setMergedFeedingData] = useState({});
  const [mergedPushingData, setMergedPushingData] = useState({});
  let reclaimingA;
  let reclaimingB;
  let reclaimingC;

  const generatePDF = async () => {
    try {
      const htmlContent = `
          <html>
            <body>
              <div style="display:flex; flex-direction: column; text-align:center; width: 800px; height:100px;">
                <h1 style="text-decoration: underline;">CPP Day Report</h1>
                <div style=" flex-direction: row">
                  <span style="font-size: 20px; font-weight:bold; margin-left:10px">
                    Date : ${selectedDate.toISOString().split("T")[0]}
                  </span>               
                </div>
              </div>
     
              <div style="display:flex; flex-direction:row; width:800px; height:800px; border:2px solid black; margin-top:10px">
                <div style=" flex-direction:column;width:200px;float:left; border-right: 2px solid black; text-align:center;align-items:flex-start;">
                <h2 style="text-decoration: underline;">Reclaiming Data</h2>
                ${Object.keys(mergedReclaimingData)
                  .map((key) =>
                    key === "cc49" ||
                    key === "cc50" ||
                    key === "cc126" ||
                    key === "total_reclaiming"
                      ? null
                      : `

                      <div style="margin-bottom: 10px; display: flex; flex-direction: row; margin-left: 10px; gap: 10px;">
                      <div style="width: 100px; height:30px; align-items: center; display: flex; justify-content: flex-end;">
                        <span style="font-size: 20px; font-weight: bold;">
                        ${key.toUpperCase()}
                        </span>
                      </div>
                      
                      <span style="font-size: 20px; font-weight: bold;">
                      ${mergedReclaimingData[key]}
                      </span>
                    </div>
                `
                  )
                  .join("")}

               
                <h3 style="text-decoration: underline; margin-top:30px ">Stream-wise Reclm</h3>
                ${["cc49", "cc50", "cc126"]
                  .map(
                    (item, index) =>
                      `

                      <div style="margin-bottom: 10px; display: flex; flex-direction: row; margin-left: 10px; gap: 10px;">
                      <div style="width: 100px; height:30px; align-items: center; display: flex; justify-content: flex-end;">
                        <span style="font-size: 20px; font-weight: bold;">
                        ${item.toUpperCase()}
                        </span>
                      </div>
                      
                      <span style="font-size: 20px; font-weight: bold;">
                      ${mergedReclaimingData[item]}
                      </span>
                    </div>
                `
                  )
                  .join("")}
                  <h3 style="text-decoration: underline; margin-top:30px">Total Reclaiming</h3>
                  <span style="font-size: 20px; font-weight:bold">${
                    mergedReclaimingData.total_reclaiming
                  }</span>
              </div>  
         
  
              <div style=" flex-direction:column;width:200px; text-align:center; border-right: 2px solid black; align-items:flex-end;">
                <h2 style="text-decoration: underline; margin-top:30px">Feeding Data</h2>
                ${["ct1", "ct2", "ct3"]
                  .map(
                    (item, index) =>
                      `
                  <div style="margin-bottom: 10px;  flex-direction: row; ">
                    <span style="font-size: 20px; font-weight:bold">
                      ${item.toUpperCase()}
                    </span>
                    <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                      ${mergedFeedingData[item]}
                    </span>
                  </div>
                `
                  )
                  .join("")}
                <h3 style="text-decoration: underline; margin-top:30px">Stream-wise Feeding</h3>
                ${["stream1", "stream1A"]
                  .map(
                    (item, index) =>
                      `

                      <div style="margin-bottom: 10px; display: flex; flex-direction: row; margin-left: 10px; gap: 10px;">
                      <div style="width: 100px; height:30px; align-items: center; display: flex; justify-content: flex-end;">
                        <span style="font-size: 20px; font-weight: bold;">
                        ${item.toUpperCase()}
                        </span>
                      </div>
                      
                      <span style="font-size: 20px; font-weight: bold;">
                      ${mergedFeedingData[item]}
                      </span>
                    </div>
                `
                  )
                  .join("")}
                  <h3 style="text-decoration: underline; margin-top:30px">Total Feeding</h3>
                  <span style="font-size: 20px; font-weight:bold">${
                    mergedFeedingData.total_feeding
                  }</span>
              </div> 


              <div style=" flex-direction:column;width:200px; text-align:center; border-right: 2px solid black; align-items:flex-end;">
                <h2 style="text-decoration: underline; margin-top:30px">Pushing Schedule</h2>
                ${["bat1", "bat2", "bat3", "bat4", "bat5"]
                  .map(
                    (item, index) =>
                      `
                  <div style="margin-bottom: 10px;  flex-direction: row; ">
                    <span style="font-size: 20px; font-weight:bold">
                      ${item.toUpperCase()}
                    </span>
                    <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                      ${mergedPushingData[item]}
                    </span>
                  </div>
                `
                  )
                  .join("")}
                  <h3 style="text-decoration: underline; margin-top:30px">Total Pushings</h3>
                  <span style="font-size: 20px; font-weight:bold">${
                    mergedPushingData.total_pushings
                  }</span>
              </div>
              
            </body>
          </html>
        `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF generated at:", uri);

      // Save the PDF to the file system
      const fileUri = `${FileSystem.documentDirectory}cpp_day_report.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });
      console.log("PDF saved at:", fileUri);

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("PDF Generated", `PDF has been saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("Error generating PDF", error);
      Alert.alert("Error", "An error occurred while generating the PDF.");
    }
  };

  const requestStoragePermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      // console.log("Permission status:", status);

      if (status === "granted") {
        // console.log("Permission granted");
        return true;
      } else {
        //console.log("Permission denied");
        /* Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the file"
        );*/
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleGeneratePdf = async () => {
    const permissionGranted = await requestStoragePermission();
    if (permissionGranted) {
      generatePDF();
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const getAShiftReclaimingData = async () => {
    if (reclaimingA !== undefined) {
      let newReclaimingCoalA = {};
      for (let i = 1; i <= 8; i++) {
        const coalName = reclaimingA[`coal${i}name`];
        const coalRecl = reclaimingA[`coal${i}recl`];
        if (coalName && coalRecl) {
          newReclaimingCoalA[coalName] = coalRecl;
        }
      }
      for (let i = 1; i <= 5; i++) {
        const excoalName = reclaimingA[`excoal${i}name`];
        const excoalRecl = reclaimingA[`excoal${i}recl`];
        if (excoalName && excoalRecl) {
          newReclaimingCoalA[excoalName] = excoalRecl;
        }
      }
      newReclaimingCoalA["cc49"] = reclaimingA.cc49recl;
      newReclaimingCoalA["cc50"] = reclaimingA.cc50recl;
      newReclaimingCoalA["cc126"] = reclaimingA.cc126recl;

      newReclaimingCoalA["total_reclaiming"] = reclaimingA.total_reclaiming;

      return newReclaimingCoalA;
    }
  };

  const getBShiftReclaimingData = async () => {
    if (reclaimingB !== undefined) {
      let newReclaimingCoalB = {};

      for (let i = 1; i <= 8; i++) {
        const coalName = reclaimingB[`coal${i}name`];
        const coalRecl = reclaimingB[`coal${i}recl`];
        if (coalName && coalRecl) {
          newReclaimingCoalB[coalName] = coalRecl;
        }
      }
      for (let i = 1; i <= 5; i++) {
        const excoalName = reclaimingB[`excoal${i}name`];
        const excoalRecl = reclaimingB[`excoal${i}recl`];
        if (excoalName && excoalRecl) {
          newReclaimingCoalB[excoalName] = excoalRecl;
        }
      }
      newReclaimingCoalB["cc49"] = reclaimingB.cc49recl;
      newReclaimingCoalB["cc50"] = reclaimingB.cc50recl;
      newReclaimingCoalB["cc126"] = reclaimingB.cc126recl;

      newReclaimingCoalB["total_reclaiming"] = reclaimingB.total_reclaiming;
      return newReclaimingCoalB;
    }
  };

  const getCShiftReclaimingData = async () => {
    if (reclaimingC !== undefined) {
      let newReclaimingCoalC = {};
      for (let i = 1; i <= 8; i++) {
        const coalName = reclaimingC[`coal${i}name`];
        const coalRecl = reclaimingC[`coal${i}recl`];
        if (coalName && coalRecl) {
          newReclaimingCoalC[coalName] = coalRecl;
        }
      }
      for (let i = 1; i <= 5; i++) {
        const excoalName = reclaimingC[`excoal${i}name`];
        const excoalRecl = reclaimingC[`excoal${i}recl`];
        if (excoalName && excoalRecl) {
          newReclaimingCoalC[excoalName] = excoalRecl;
        }
      }
      newReclaimingCoalC["cc49"] = reclaimingC.cc49recl;
      newReclaimingCoalC["cc50"] = reclaimingC.cc50recl;
      newReclaimingCoalC["cc126"] = reclaimingC.cc126recl;

      newReclaimingCoalC["total_reclaiming"] = reclaimingC.total_reclaiming;
      return newReclaimingCoalC;
    }
  };

  const mergeReclaiming = (...reclaimings) => {
    return reclaimings.reduce((merge, reclaiming) => {
      Object.keys(reclaiming).forEach((key) => {
        merge[key] = (merge[key] || 0) + reclaiming[key];
      });

      return merge;
    }, {});
  };

  const getTotalFeeding = async (date) => {
    try {
      const response = await axios.get(BaseUrl + "/feeding/daywise", {
        params: {
          date: date,
        },
      });
      // Extract and set the data
      if (
        response.data.data[0] &&
        response.data.data[1] &&
        response.data.data[2]
      ) {
        const data = response.data.data;
        let newFeedingCoal = {};
        newFeedingCoal["ct1"] = data[0].ct1 + data[1].ct1 + data[2].ct1;
        newFeedingCoal["ct2"] = data[0].ct2 + data[1].ct2 + data[2].ct2;
        newFeedingCoal["ct3"] = data[0].ct3 + data[1].ct3 + data[2].ct3;
        newFeedingCoal["stream1"] =
          data[0].stream1 + data[1].stream1 + data[2].stream1;
        newFeedingCoal["stream1A"] =
          data[0].stream1A + data[1].stream1A + data[2].stream1A;
        newFeedingCoal["total_feeding"] =
          data[0].total_feeding + data[1].total_feeding + data[2].total_feeding;
        setLoadData(true);
        return newFeedingCoal;
      } else {
        setLoadData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPushings = async (date) => {
    try {
      const response = await axios.get(BaseUrl + "/pushings/daywise", {
        params: {
          date: date,
        },
      });
      // Extract and set the data
      if (
        response.data.data[0] &&
        response.data.data[1] &&
        response.data.data[2]
      ) {
        const data = response.data.data;

        let newPushings = {};
        newPushings["bat1"] = data[0].bat1 + data[1].bat1 + data[2].bat1;
        newPushings["bat2"] = data[0].bat2 + data[1].bat2 + data[2].bat2;
        newPushings["bat3"] = data[0].bat3 + data[1].bat3 + data[2].bat3;
        newPushings["bat4"] = data[0].bat4 + data[1].bat4 + data[2].bat4;
        newPushings["bat5"] = data[0].bat5 + data[1].bat5 + data[2].bat5;

        newPushings["total_pushings"] =
          data[0].total_pushings +
          data[1].total_pushings +
          data[2].total_pushings;
        setLoadData(true);
        return newPushings;
      } else {
        setLoadData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    let date = new Date(selectedDate).toISOString().split("T")[0];

    await getReclaimingDataDaywise(date);
    let reclaimingCoalA = await getAShiftReclaimingData();
    let reclaimingCoalB = await getBShiftReclaimingData();
    let reclaimingCoalC = await getCShiftReclaimingData();
    if (reclaimingA && reclaimingB && reclaimingC) {
      let mergedReclData = mergeReclaiming(
        reclaimingCoalA,
        reclaimingCoalB,
        reclaimingCoalC
      );
      setMergedReclaimingData(mergedReclData);
    }

    let feedingData = await getTotalFeeding(date);
    if (feedingData !== undefined) {
      console.log("inside feed");
      setMergedFeedingData(feedingData);
    }

    let pushingData = await getTotalPushings(date);
    if (pushingData !== undefined) {
      console.log("inside push");
      setMergedPushingData(pushingData);
    }

    setLoadCard(true);
  };

  const getReclaimingDataDaywise = async (date) => {
    try {
      const response = await axios.get(BaseUrl + "/reclaiming/daywise", {
        params: {
          date: date,
        },
      });
      // Extract and set the data
      if (
        response.data.data[0] &&
        response.data.data[1] &&
        response.data.data[2]
      ) {
        const data = response.data.data;
        reclaimingA = data[0];
        reclaimingB = data[1];
        reclaimingC = data[2];
        setLoadData(true);
      } else {
        setLoadData(false);
        alert("Data not available in the selected date..");
      }
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch data. Please check the date and try again."
      );
    }
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
            Day Report View
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
            title="Select date"
            buttonStyle={{ width: wp(40), height: hp(5) }}
            titleStyle={{
              fontSize: hp(2),
              color: "white",
              borderBottomWidth: 2,
              borderBottomColor: "white",
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
          <Text style={{ fontSize: hp(2.5), color: "green" }}>
            {FormatDate(selectedDate)}
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
        {loadData && loadCard && (
          <View style={{ marginTop: hp(1), marginBottom: hp(2) }}>
            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Reclaiming
              </Card.Title>
              <Card.Divider />

              {mergedReclaimingData && (
                <View>
                  {Object.keys(mergedReclaimingData).map((key) => {
                    if (
                      key !== "cc49" &&
                      key !== "cc50" &&
                      key !== "cc126" &&
                      key != "total_reclaiming"
                    ) {
                      return (
                        <View
                          key={key}
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
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {key.toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {mergedReclaimingData[key]}
                          </Text>
                        </View>
                      );
                    }
                  })}

                  <Card.Divider />
                  {["cc49", "cc50", "cc126"].map((item, index) => (
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
                          {item.toUpperCase()}
                        </Text>
                      </View>
                      <Divider orientation="vertical" />

                      <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                        {mergedReclaimingData[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View>
                    <View
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: hp(3),
                      }}
                    >
                      <View
                        style={{
                          width: wp(40),
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(5),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          Total Reclaiming
                        </Text>
                      </View>
                      <Divider orientation="vertical" />
                      <View
                        style={{
                          width: wp(25),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(6),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {mergedReclaimingData.total_reclaiming}
                        </Text>
                      </View>
                    </View>
                    <Card.Divider />
                  </View>
                </View>
              )}
            </Card>

            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Feeding
              </Card.Title>
              <Card.Divider />

              {mergedFeedingData && (
                <View>
                  {Object.keys(mergedFeedingData).map((key) => {
                    if (
                      key !== "stream1" &&
                      key !== "stream1A" &&
                      key != "total_feeding"
                    ) {
                      return (
                        <View
                          key={key}
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
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {key.toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {mergedFeedingData[key]}
                          </Text>
                        </View>
                      );
                    }
                  })}

                  <Card.Divider />
                  {["stream1", "stream1A"].map((item, index) => (
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
                          {item.toUpperCase()}
                        </Text>
                      </View>
                      <Divider orientation="vertical" />

                      <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                        {mergedFeedingData[item]}
                      </Text>
                    </View>
                  ))}
                  <Card.Divider />
                  <View>
                    <View
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: hp(3),
                      }}
                    >
                      <View
                        style={{
                          width: wp(40),
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(5),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          Total Feeding
                        </Text>
                      </View>
                      <Divider orientation="vertical" />
                      <View
                        style={{
                          width: wp(25),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(6),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {mergedFeedingData.total_feeding}
                        </Text>
                      </View>
                    </View>
                    <Card.Divider />
                  </View>
                </View>
              )}
            </Card>

            <Card>
              <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                Pushings
              </Card.Title>
              <Card.Divider />

              {mergedPushingData && (
                <View>
                  {Object.keys(mergedPushingData).map((key) => {
                    if (key != "total_pushings") {
                      return (
                        <View
                          key={key}
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
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {key.toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {mergedPushingData[key]}
                          </Text>
                        </View>
                      );
                    }
                  })}

                  <Card.Divider />
                  <View>
                    <View
                      style={{
                        marginBottom: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: hp(3),
                      }}
                    >
                      <View
                        style={{
                          width: wp(40),
                          alignItems: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(5),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          Total Pushings
                        </Text>
                      </View>
                      <Divider orientation="vertical" />
                      <View
                        style={{
                          width: wp(25),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(6),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {mergedPushingData.total_pushings}
                        </Text>
                      </View>
                    </View>
                    <Card.Divider />
                  </View>
                </View>
              )}
            </Card>

            <View>
              <Button
                title="Generate PDF"
                buttonStyle={{
                  width: wp(50),
                  borderRadius: 25,
                  alignSelf: "center",
                  margin: 10,
                }}
                onPress={handleGeneratePdf}
              />
              {/*data ? <Text>Data loaded</Text> : <Text>Loading data...</Text>*/}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
