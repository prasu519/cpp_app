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
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function BlendReportView({ navigation }) {
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [blendData, setBlendData] = useState([]);
  const [dateShiftArray, setDateShiftArray] = useState([]);
  const [blendFeedingArray, setBlendFeedingArray] = useState([]);
  const [clickSubmit, setClickSubmit] = useState(false);

  const [excludedKeys, setExcludedKeys] = useState([
    "__v",
    "_id",
    "date",
    "shift",
    "empnum",
    "total",
  ]);

  const generatePDF = async () => {
    try {
      const htmlContent = `
          <html>
            <body>
              <div style="display:flex; flex-direction: column; text-align:center; width: 800px; height:100px;">
                <h1 style="text-decoration: underline;">CPP-1 Blend Report</h1>
                <div style=" flex-direction: row">
                  <span style="font-size: 30px; font-weight:bold;">
                    From Date : ${selectedFromDate.toISOString().split("T")[0]}
                  </span>   
                  <span style="font-size: 30px; font-weight:bold; margin-left:10px">
                    To Date : ${selectedToDate.toISOString().split("T")[0]}
                  </span>            
                </div>
              </div>
     
              <div style="display:flex; flex-direction:row; width:800px; height:800px; border:2px solid black; margin-top:10px">
                <div style=" flex-direction:column;width:200px;float:left; border-right: 2px solid black; text-align:center;align-items:flex-start;">
                ${
                  blendData.length !== 0
                    ? blendData
                        .map(
                          (item, index) => `
                          <h2 style="text-decoration: underline;">Blend- ${
                            index + 1
                          }</h2>
                          <div style="margin-bottom: 10px;  flex-direction: row; ">
                          <span style="font-size: 20px; font-weight:bold">
                            Date
                          </span>
                          <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                          ${blendData[index]["date"].split("T", 1)}
                          </span>
                        </div>

                        <div style="margin-bottom: 10px;  flex-direction: row; ">
                        <span style="font-size: 20px; font-weight:bold">
                          Shift
                        </span>
                        <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                        ${blendData[index]["shift"].split("T", 1)}
                        </span>
                      </div>
                          `
                        )
                        .join("")
                    : ""
                }
              </div>  
         
  
              <div style=" flex-direction:column;width:200px; text-align:center; border-right: 2px solid black; align-items:flex-end;">
                <h2 style="text-decoration: underline;">CPP3 Reclaiming</h2>
              </div> 
       

              <div style=" flex-direction:column;width:200px; text-align:center; border-right: 2px solid black; align-items:flex-end;">
                <h2 style="text-decoration: underline;">Feeding Data</h2>
                <h2 style="text-decoration: underline; margin-top:30px">Stream-Feeding</h2>
                <h2 style="text-decoration: underline; margin-top:30px">Total Feeding</h2>    
              </div>

              <div style=" flex-direction:column;width:200px; text-align:center; border-right: 2px solid black; align-items:flex-end;">
                <h2 style="text-decoration: underline;">MB Top Stock</h2>
              </div>
            
            </body>
          </html>
        `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      //console.log("PDF generated at:", uri);

      // Save the PDF to the file system
      const fileUri = `${FileSystem.documentDirectory}cpp1_blend_report.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });
      //console.log("PDF saved at:", fileUri);

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

  useEffect(() => {
    if (blendData.length > 0) {
      dateShiftSaparator();
    }
  }, [blendData]);

  useEffect(() => {
    if (dateShiftArray.length > 0) {
      buildBlendFeedingRanges(dateShiftArray);
    }
  }, [dateShiftArray]);

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
      setBlendData(response.data.data || []);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch data. Please check the date and try again."
      );
    }
  };

  const getPreviousShift = (shift) => {
    if (shift === "A") return "C";
    if (shift === "B") return "A";
    if (shift === "C") return "B";
  };

  const getPreviousDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const dateShiftSaparator = () => {
    if (!Array.isArray(blendData)) return;

    setBlendFeedingArray([]); // clear previous data

    const sorted = [...blendData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const result = sorted.map((item) => [item.date.split("T")[0], item.shift]);

    setDateShiftArray(result);
  };

  const buildBlendFeedingRanges = async (arr) => {
    let results = [];

    for (let i = 0; i < arr.length; i++) {
      const [startDate, startShift] = arr[i];

      if (i === arr.length - 1) {
        // last blend ends at selectedToDate and previous shift of last
        results.push({
          startDate,
          startShift,
          endDate: new Date(selectedToDate).toISOString().split("T")[0],
          endShift: "C", //getPreviousShift(startShift),
        });
      } else {
        const [nextDate, nextShift] = arr[i + 1];

        let endDate = nextDate;
        let endShift = getPreviousShift(nextShift);

        if (nextShift === "A") {
          endDate = getPreviousDate(nextDate);
          endShift = "C";
        }

        results.push({
          startDate,
          startShift,
          endDate,
          endShift,
        });
      }
    }

    // call feeding API for each blend
    const feeds = [];

    for (const r of results) {
      const val = await getFeedingBlendWise(
        r.startDate,
        r.startShift,
        r.endDate,
        r.endShift
      );

      feeds.push(val);
    }

    setBlendFeedingArray(feeds);
  };

  const getFeedingBlendWise = async (
    blendStartDate,
    blendStartShift,
    blendEndDate,
    blendEndShift
  ) => {
    try {
      //console.log(blendStartDate, blendStartShift, blendEndDate, blendEndShift);
      const response = await axios.get(BaseUrl + "/feeding/totfeeding", {
        params: {
          fdate: blendStartDate,
          fshift: blendStartShift,
          tdate: blendEndDate,
          tshift: blendEndShift,
        },
      });

      return response.data.data; // <-- IMPORTANT
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch total feeding cpp1.");
      return 0;
    }
  };

  const handleSubmit = async () => {
    const todaydate = new Date();
    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];
    let todayDate = new Date(todaydate).toISOString().split("T")[0];

    if (toDate >= todayDate) {
      Alert.alert("Invalid Date", "To Date should be less than today's date.");
      return; // Exit the function
    }
    if (fromDate >= todayDate) {
      Alert.alert(
        "Invalid Date",
        "From Date should be less than today's date."
      );
      return; // Exit the function
    }
    if (fromDate > toDate) {
      Alert.alert(
        "Invalid Date",
        "From Date should be less than To Date date."
      );
      return; // Exit the function
    }
    setClickSubmit(true);
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
      <ScrollView>
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

        {blendData.length !== 0
          ? Array.from({ length: blendData.length }, (_, index) => (
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
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
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
                <Card.Divider />
                <View
                  key={index + 2}
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
                      Feeding
                    </Text>
                  </View>
                  <Divider orientation="vertical" />
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {blendFeedingArray[index]
                      ? Number(blendFeedingArray[index].totalStream1 || 0) +
                        Number(blendFeedingArray[index].totalStream1A || 0)
                      : "Loading..."}
                  </Text>
                </View>
              </Card>
            ))
          : clickSubmit && (
              <View
                style={{
                  width: wp(100),
                  height: hp(20),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: hp(4),
                  }}
                >
                  No Data Available
                </Text>
              </View>
            )}
        {/* <Button
          title={"Download PDF"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            marginBottom: hp(2),
            alignSelf: "center",
          }}
          onPress={handleGeneratePdf}
          radius={20}
          titleStyle={{
            textDecorationLine: "underline",
            fontSize: hp(2),
            fontWeight: "600",
          }}
        />*/}
      </ScrollView>
    </View>
  );
}
