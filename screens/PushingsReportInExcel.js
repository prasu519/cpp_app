import { View, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@rneui/base";
import { Text } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import BaseUrl from "../config/BaseUrl";
import axios from "axios";

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function PushingsReportInExcel({ navigation }) {
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedFromShift, setSelectedFromShift] = useState("");
  const [selectedToShift, setSelectedToShift] = useState("");
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPushings, setAllPushings] = useState();
  const [mergedFeedings, setMergedFeedings] = useState();
  const [ctStocksCShift, setCTStocksCShift] = useState();
  const [ctStocksPrevDayCShift, setCTStocksPrevDayCShift] = useState();
  const [pushingReportExcel, setPushingReportExcel] = useState();

  const exportToExcel = async (
    finalData,
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    if (!finalData || finalData.length === 0) {
      alert("No data");
      return;
    }

    let rows = [];

    // 🔥 TITLE ROW
    rows.push(["PUSHINGS REPORT"]);
    rows.push([]);

    // 🔥 HEADER ROW
    rows.push([
      "DATE",
      "BATT 1&2",
      "CT-1 Feeding",
      "charge/oven",
      "BATT 3&4",
      "CT-2 Feeding",
      "charge/oven",
      "BATT-5",
      "CT-3 Feeding",
      "charge/oven",
    ]);

    let totalBat12 = 0,
      totalBat34 = 0,
      totalBat5 = 0;
    let totalCt1 = 0,
      totalCt2 = 0,
      totalCt3 = 0;
    let sum1 = 0,
      sum2 = 0,
      sum3 = 0;

    finalData.forEach((item) => {
      rows.push([
        item.date,
        item.bat12,
        item.ct1,
        item.charge_per_oven_ct1,
        item.bat34,
        item.ct2,
        item.charge_per_oven_ct2,
        item.bat5,
        item.ct3,
        item.charge_per_oven_ct3,
      ]);

      totalBat12 += item.bat12;
      totalBat34 += item.bat34;
      totalBat5 += item.bat5;

      totalCt1 += item.ct1;
      totalCt2 += item.ct2;
      totalCt3 += item.ct3;

      sum1 += item.charge_per_oven_ct1;
      sum2 += item.charge_per_oven_ct2;
      sum3 += item.charge_per_oven_ct3;
    });

    const count = finalData.length;
    const avg1 = (sum1 / count).toFixed(2);
    const avg2 = (sum2 / count).toFixed(2);
    const avg3 = (sum3 / count).toFixed(2);

    rows.push([]);
    rows.push([
      "TOTAL",
      totalBat12,
      totalCt1,
      "",
      totalBat34,
      totalCt2,
      "",
      totalBat5,
      totalCt3,
      "",
    ]);

    rows.push(["AVERAGE", "", "", avg1, "", "", avg2, "", "", avg3]);

    // 🔥 SHEET
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // 🔥 MERGE TITLE
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 9 },
      },
    ];

    // 🔥 COLUMN WIDTH
    ws["!cols"] = [
      { wch: 14 },
      { wch: 10 },
      { wch: 14 },
      { wch: 14 },
      { wch: 10 },
      { wch: 14 },
      { wch: 14 },
      { wch: 10 },
      { wch: 14 },
      { wch: 14 },
    ];

    // 🔥 FREEZE HEADER + DATE COLUMN
    ws["!freeze"] = { xSplit: 1, ySplit: 3 };

    // 🔥 BOLD TITLE + HEADERS (works in Excel)
    const boldStyle = { font: { bold: true, sz: 16 } };
    ws["A1"].s = boldStyle;

    for (let c = 0; c <= 9; c++) {
      const cell = XLSX.utils.encode_cell({ r: 2, c });
      if (ws[cell]) {
        ws[cell].s = { font: { bold: true } };
      }
    }

    // 🔥 WORKBOOK
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pushings");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // 🔥 FILE NAME WITH DATE & SHIFT
    const fileName = `Pushings_${fromDate}_${fromShift}_to_${toDate}_${toShift}.xlsx`;

    const uri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(uri);
  };

  const getAllPushings = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const responce = await axios.get(BaseUrl + "/pushings/excelreport", {
        params: {
          fromdate: fromDate,
          fromshift: fromShift,
          todate: toDate,
          toshift: toShift,
        },
      });
      setAllPushings(responce.data.data);
      generatePushingExcelData(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch all pushings. Please check the date and try again."
      );
    }
  };

  const generatePushingExcelData = (pushingsData) => {
    if (!pushingsData || pushingsData.length === 0) {
      setPushingReportExcel([]);
      return;
    }

    // 🔥 flatten full array first
    const flat = pushingsData.flat();

    // 🔥 group by date
    const grouped = {};

    flat.forEach((item) => {
      const dt = item.date;

      if (!grouped[dt]) {
        grouped[dt] = {
          date: dt,
          bat1: 0,
          bat2: 0,
          bat3: 0,
          bat4: 0,
          bat5: 0,
        };
      }

      grouped[dt].bat1 += Number(item.bat1 || 0);
      grouped[dt].bat2 += Number(item.bat2 || 0);
      grouped[dt].bat3 += Number(item.bat3 || 0);
      grouped[dt].bat4 += Number(item.bat4 || 0);
      grouped[dt].bat5 += Number(item.bat5 || 0);
    });

    // 🔥 final format
    const finalData = Object.values(grouped).map((d) => ({
      date: d.date,
      bat12: d.bat1 + d.bat2,
      bat34: d.bat3 + d.bat4,
      bat5: d.bat5,
    }));

    //console.log("Pushings for EXCEL:", finalData);
    setPushingReportExcel(finalData);
  };

  const generatePushingExcelDataLocal = (pushingsData) => {
    const flat = pushingsData.flat();
    const grouped = {};

    flat.forEach((item) => {
      const dt = item.date;
      if (!grouped[dt])
        grouped[dt] = { date: dt, bat1: 0, bat2: 0, bat3: 0, bat4: 0, bat5: 0 };

      grouped[dt].bat1 += +item.bat1 || 0;
      grouped[dt].bat2 += +item.bat2 || 0;
      grouped[dt].bat3 += +item.bat3 || 0;
      grouped[dt].bat4 += +item.bat4 || 0;
      grouped[dt].bat5 += +item.bat5 || 0;
    });

    return Object.values(grouped).map((d) => ({
      date: d.date,
      bat12: d.bat1 + d.bat2,
      bat34: d.bat3 + d.bat4,
      bat5: d.bat5,
    }));
  };

  /* const getAllFeedings = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const responce = await axios.get(
        BaseUrl + "/feeding/feedingforpushingexcel",
        {
          params: {
            fromdate: fromDate,
            fromshift: fromShift,
            todate: toDate,
            toshift: toShift,
          },
        }
      );
      setMergedFeedings(responce.data.data);
      console.log(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch all feedings. Please check the date and try again."
      );
    }
  };*/
  const getAllFeedings = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const responce = await axios.get(
        BaseUrl + "/feeding/feedingforpushingexcel",
        {
          params: {
            fromdate: fromDate,
            fromshift: fromShift,
            todate: toDate,
            toshift: toShift,
          },
        }
      );

      const rawData = responce.data.data;

      // 🔥 merge A+B+C shift date wise
      const mergedData = generateFeedingMergedDateWise(rawData);
      setMergedFeedings(mergedData);
    } catch (error) {
      console.log(error);
      alert("Error", "Failed to fetch feedings.");
    }
  };

  const generateFeedingMergedDateWise = (feedingData) => {
    if (!feedingData || feedingData.length === 0) return [];

    // 🔥 flatten full array first
    const flat = feedingData.flat();

    // 🔥 group by date
    const grouped = {};

    flat.forEach((item) => {
      const dt = item.date;

      if (!grouped[dt]) {
        grouped[dt] = {
          date: dt,
          ct1: 0,
          ct2: 0,
          ct3: 0,
        };
      }

      grouped[dt].ct1 += Number(item.ct1 || 0);
      grouped[dt].ct2 += Number(item.ct2 || 0);
      grouped[dt].ct3 += Number(item.ct3 || 0);
    });

    // 🔥 final array format
    const finalData = Object.values(grouped);

    //console.log("Merged Feeding Date-wise:", finalData);
    return finalData;
  };

  const getPrevDayCShiftCoalTowerStocks = async (
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    try {
      let prvfromdate;
      let prvtodate;

      const pfdate = new Date(fromDate);
      pfdate.setDate(pfdate.getDate() - 1);
      prvfromdate = pfdate.toISOString().split("T")[0];

      const ptdate = new Date(toDate);
      ptdate.setDate(ptdate.getDate() - 1);
      prvtodate = ptdate.toISOString().split("T")[0];
      //setPrevDayDate(prvdate);

      const responce = await axios.get(
        BaseUrl + "/coaltowerstock/coaltowerStocksCShiftexcel",
        {
          params: {
            fromdate: prvfromdate,
            fromshift: fromShift,
            todate: prvtodate,
            toshift: toShift,
          },
        }
      );
      setCTStocksPrevDayCShift(responce.data.data);
      //console.log(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch all feedings. Please check the date and try again."
      );
    }
  };

  const getCShiftCoalTowerStocks = async (
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    try {
      const responce = await axios.get(
        BaseUrl + "/coaltowerstock/coaltowerStocksCShiftexcel",
        {
          params: {
            fromdate: fromDate,
            fromshift: fromShift,
            todate: toDate,
            toshift: toShift,
          },
        }
      );
      setCTStocksCShift(responce.data.data);
      //console.log(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch all feedings. Please check the date and try again."
      );
    }
  };

  const generateFinalReport = () => {
    if (
      !mergedFeedings ||
      !ctStocksPrevDayCShift ||
      !ctStocksCShift ||
      !pushingReportExcel
    ) {
      console.log("Missing data");
      return [];
    }

    const result = [];

    mergedFeedings.forEach((feed) => {
      const dt = feed.date;

      // 🔥 feeding
      const ct1Feed = Number(feed.ct1 || 0);
      const ct2Feed = Number(feed.ct2 || 0);
      const ct3Feed = Number(feed.ct3 || 0);

      // 🔥 pushings (bat data)
      const pushObj = pushingReportExcel.find((p) => p.date === dt) || {};
      const bat12 = Number(pushObj.bat12 || 0);
      const bat34 = Number(pushObj.bat34 || 0);
      const bat5 = Number(pushObj.bat5 || 0);

      // 🔥 previous day stocks
      const prevObj =
        ctStocksPrevDayCShift?.flat()?.find((d) => d.date === dt) || {};
      const prevCt1 = Number(prevObj.ct1 || 0);
      const prevCt2 = Number(prevObj.ct2 || 0);
      const prevCt3 = Number(prevObj.ct3 || 0);

      // 🔥 same day closing stocks
      const sameObj = ctStocksCShift?.flat()?.find((d) => d.date === dt) || {};
      const sameCt1 = Number(sameObj.ct1 || 0);
      const sameCt2 = Number(sameObj.ct2 || 0);
      const sameCt3 = Number(sameObj.ct3 || 0);

      // 🔥 charge per oven
      let charge1 = 0;
      let charge2 = 0;
      let charge3 = 0;

      if (bat12 > 0) {
        charge1 = (prevCt1 + ct1Feed - sameCt1) / bat12;
        charge2 = (prevCt2 + ct2Feed - sameCt2) / bat12;
        charge3 = (prevCt3 + ct3Feed - sameCt3) / bat12;
      }

      result.push({
        date: dt,

        bat12: bat12,
        ct1: ct1Feed,
        charge_per_oven_ct1: Number(charge1.toFixed(2)),

        bat34: bat34,
        ct2: ct2Feed,
        charge_per_oven_ct2: Number(charge2.toFixed(2)),

        bat5: bat5,
        ct3: ct3Feed,
        charge_per_oven_ct3: Number(charge3.toFixed(2)),
      });
    });

    console.log("🔥 FINAL ARRAY:", result);
    return result;
  };

  const generateFinalReportLocal = (
    mergedFeedings,
    prevStocks,
    sameStocks,
    pushingData
  ) => {
    const result = [];

    mergedFeedings.forEach((feed, index) => {
      const dt = feed.date;

      const ct1 = +feed.ct1 || 0;
      const ct2 = +feed.ct2 || 0;
      const ct3 = +feed.ct3 || 0;

      const push = pushingData.find((p) => p.date === dt) || {};
      const bat12 = +push.bat12 || 0;
      const bat34 = +push.bat34 || 0;
      const bat5 = +push.bat5 || 0;

      const prev = prevStocks[index]?.[0] || {};
      const same = sameStocks[index]?.[0] || {};

      const prevCt1 = +prev.ct1stock || 0;
      const prevCt2 = +prev.ct2stock || 0;
      const prevCt3 = +prev.ct3stock || 0;

      const sameCt1 = +same.ct1stock || 0;
      const sameCt2 = +same.ct2stock || 0;
      const sameCt3 = +same.ct3stock || 0;

      let charge1 = 0;
      let charge2 = 0;
      let charge3 = 0;

      // 🔥 CORRECT DENOMINATORS
      if (bat12 > 0) {
        charge1 = (prevCt1 + ct1 - sameCt1) / bat12;
      }

      if (bat34 > 0) {
        charge2 = (prevCt2 + ct2 - sameCt2) / bat34;
      }

      if (bat5 > 0) {
        charge3 = (prevCt3 + ct3 - sameCt3) / bat5;
      }

      result.push({
        date: dt,
        bat12,
        ct1,
        charge_per_oven_ct1: +charge1.toFixed(2),

        bat34,
        ct2,
        charge_per_oven_ct2: +charge2.toFixed(2),

        bat5,
        ct3,
        charge_per_oven_ct3: +charge3.toFixed(2),
      });
    });

    return result;
  };

  /*const handleSubmit = async () => {
    if (selectedFromShift === undefined || selectedToShift == undefined) {
      alert("please enter shift");
      return;
    }
    const todaydate = new Date();
    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let fromShift = selectedFromShift;
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];
    let toShift = selectedToShift;
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
    if (fromDate == toDate && fromShift > toShift) {
      Alert.alert(
        "Invalid Date",
        "From Shift should be less than To shift in same date."
      );
      return; // Exit the function
    }

    await getAllPushings(fromDate, fromShift, toDate, toShift);
    await getAllFeedings(fromDate, fromShift, toDate, toShift);
    await getCShiftCoalTowerStocks(fromDate, fromShift, toDate, toShift);
    await getPrevDayCShiftCoalTowerStocks(fromDate, fromShift, toDate, toShift);
    setTimeout(() => {
      const final = generateFinalReport();
      console.log("FINAL REPORT:", final);
    }, 800);
  };*/

  const handleSubmit = async () => {
    if (!selectedFromShift || !selectedToShift) {
      alert("please enter shift");
      return;
    }

    const todaydate = new Date();
    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let fromShift = selectedFromShift;
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];
    let toShift = selectedToShift;
    let todayDate = new Date(todaydate).toISOString().split("T")[0];

    if (toDate >= todayDate) {
      Alert.alert("Invalid Date", "To Date should be less than today's date.");
      return;
    }
    if (fromDate >= todayDate) {
      Alert.alert(
        "Invalid Date",
        "From Date should be less than today's date."
      );
      return;
    }
    if (fromDate > toDate) {
      Alert.alert("Invalid Date", "From Date should be less than To Date.");
      return;
    }
    if (fromDate == toDate && fromShift > toShift) {
      Alert.alert("Invalid", "From Shift must be <= To Shift");
      return;
    }

    try {
      setLoading(true);

      // 🔥 1. PUSHINGS
      const pushRes = await axios.get(BaseUrl + "/pushings/excelreport", {
        params: {
          fromdate: fromDate,
          fromshift: fromShift,
          todate: toDate,
          toshift: toShift,
        },
      });
      const pushFormatted = generatePushingExcelDataLocal(pushRes.data.data);

      // 🔥 2. FEEDINGS
      const feedRes = await axios.get(
        BaseUrl + "/feeding/feedingforpushingexcel",
        {
          params: {
            fromdate: fromDate,
            fromshift: fromShift,
            todate: toDate,
            toshift: toShift,
          },
        }
      );
      const mergedFeed = generateFeedingMergedDateWise(feedRes.data.data);

      // 🔥 3. SAME DAY STOCK
      const sameStockRes = await axios.get(
        BaseUrl + "/coaltowerstock/coaltowerStocksCShiftexcel",
        {
          params: {
            fromdate: fromDate,
            fromshift: fromShift,
            todate: toDate,
            toshift: toShift,
          },
        }
      );

      // 🔥 4. PREV DAY STOCK
      let pf = new Date(fromDate);
      pf.setDate(pf.getDate() - 1);
      let pt = new Date(toDate);
      pt.setDate(pt.getDate() - 1);

      const prevStockRes = await axios.get(
        BaseUrl + "/coaltowerstock/coaltowerStocksCShiftexcel",
        {
          params: {
            fromdate: pf.toISOString().split("T")[0],
            fromshift: fromShift,
            todate: pt.toISOString().split("T")[0],
            toshift: toShift,
          },
        }
      );

      // 🔥 FINAL REPORT
      const final = generateFinalReportLocal(
        mergedFeed,
        prevStockRes.data.data,
        sameStockRes.data.data,
        pushFormatted
      );
      exportToExcel(final, fromDate, fromShift, toDate, toShift);

      //console.log("🔥 FINAL REPORT:", final);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Error generating report");
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
            gap: wp(8),
          }}
        >
          <AntDesign
            name="leftcircle"
            size={40}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
            Pushings Report In Excel
          </Text>
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            position: "relative",
            marginTop: hp(15),
            padding: hp(2),
            gap: wp(2),
            height: hp(55),
            backgroundColor: "#EFECE3",
            borderRadius: 20,
            top: wp(1),
            borderWidth: 0.5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(5),
              width: wp(50),
              backgroundColor: "lightgreen",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: wp(6),
                color: "black",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              From
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(90),
              backgroundColor: "lightgrey",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(2),
                alignItems: "center",
                justifyContent: "center",
                height: hp(5),
                width: wp(45),
              }}
            >
              <Button
                title="Date"
                buttonStyle={{ width: wp(18), height: hp(5) }}
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
                  onChange={(e, d) => {
                    setShowFromDatePicker(false);
                    if (d) setSelectedFromDate(d);
                  }} //onChange={handleFromDateChange}
                />
              )}
              <Text style={{ fontSize: hp(2), color: "red" }}>
                {selectedFromDate.toISOString().split("T")[0]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(1),
                alignItems: "center",
                height: hp(5),
                width: wp(40),
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  height: hp(5),
                  width: wp(18),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#6495ED",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Shift
                </Text>
              </View>
              <Picker
                id="Shift"
                style={{
                  width: wp(25),
                }}
                mode="dropdown"
                enabled={true}
                onValueChange={(shift) => setSelectedFromShift(shift)}
                selectedValue={selectedFromShift}
              >
                {[" ", "A", "B", "C"].map((shift) => (
                  <Picker.Item
                    key={shift}
                    label={shift.toString()}
                    value={shift}
                    style={{ fontSize: hp(2), color: "red" }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View
            style={{
              width: wp(90),
              marginVertical: wp(7),
              borderBottomColor: "lightgrey",
              borderBottomWidth: wp(0.5),
              top: hp(1),
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(5),
              width: wp(20),
              backgroundColor: "lightgreen",
              borderRadius: 25,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: wp(6),
                color: "black",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              To
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(90),
              backgroundColor: "lightgrey",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(2),
                alignItems: "center",
                justifyContent: "center",
                height: hp(5),
                width: wp(45),
              }}
            >
              <Button
                title="Date"
                buttonStyle={{ width: wp(18), height: hp(5) }}
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
                  onChange={(e, d) => {
                    setShowToDatePicker(false);
                    if (d) setSelectedToDate(d);
                  }} //onChange={handleToDateChange}
                />
              )}
              <Text style={{ fontSize: hp(2), color: "red" }}>
                {selectedToDate.toISOString().split("T")[0]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(1),
                alignItems: "center",
                height: hp(5),
                width: wp(40),
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  height: hp(5),
                  width: wp(18),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#6495ED",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Shift
                </Text>
              </View>
              <Picker
                id="Shift"
                style={{
                  width: wp(25),
                }}
                mode="dropdown"
                enabled={true}
                onValueChange={(shift) => setSelectedToShift(shift)}
                selectedValue={selectedToShift}
              >
                {[" ", "A", "B", "C"].map((shift) => (
                  <Picker.Item
                    key={shift}
                    label={shift.toString()}
                    value={shift}
                    style={{ fontSize: hp(2), color: "red" }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(80),

              borderRadius: 25,
            }}
          >
            <Button
              title={loading ? "Generating..." : "Get Report"}
              disabled={loading}
              color={"#000080"}
              buttonStyle={{
                height: hp(6),
                width: wp(40),
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
        </View>
      </ScrollView>
    </View>
  );
}
