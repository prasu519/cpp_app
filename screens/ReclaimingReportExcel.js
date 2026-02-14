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
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import BaseUrl from "../config/BaseUrl";

export default function ReclaimingReportExcel({ navigation }) {
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [selectedFromShift, setSelectedFromShift] = useState("");
  const [selectedToShift, setSelectedToShift] = useState("");
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const downloadExcel = async () => {
    try {
      setLoading(true);

      const fromDate = selectedFromDate.toISOString().split("T")[0];
      const toDate = selectedToDate.toISOString().split("T")[0];

      const url =
        `${BaseUrl}/reclaiming/reclaiminginexcel` +
        `?fdate=${fromDate}&fshift=${selectedFromShift}` +
        `&tdate=${toDate}&tshift=${selectedToShift}`;

      console.log("Downloading from:", url);

      // 🔵 fetch first to get filename
      const response = await fetch(url);

      const disposition = response.headers.get("Content-Disposition");

      let fileName = "Reclaiming.xlsx";

      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Excel download failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SAFE BINARY DOWNLOAD
  const downloadExcelFromBackend = async () => {
    try {
      setLoading(true);

      const fromDate = selectedFromDate.toISOString().split("T")[0];
      const toDate = selectedToDate.toISOString().split("T")[0];

      const url =
        `${BaseUrl}/feeding/feedinginexcel` +
        `?fdate=${fromDate}&fshift=${selectedFromShift}` +
        `&tdate=${toDate}&tshift=${selectedToShift}`;

      console.log("Downloading from:", url);

      const fileUri =
        FileSystem.documentDirectory +
        `CPP_FEEDING_${fromDate}_TO_${toDate}.xlsx`;

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (!result || !result.uri) {
        throw new Error("Download failed");
      }

      await Sharing.shareAsync(result.uri);
    } catch (err) {
      console.error("Download error:", err);
      Alert.alert("Error", "Failed to download Excel");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFromShift || !selectedToShift) {
      Alert.alert("Error", "Please select both shifts");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const fromDate = selectedFromDate.toISOString().split("T")[0];
    const toDate = selectedToDate.toISOString().split("T")[0];

    if (fromDate >= today || toDate >= today) {
      Alert.alert("Invalid Date", "Dates must be before today");
      return;
    }

    if (fromDate > toDate) {
      Alert.alert("Invalid Date", "From Date must be before To Date");
      return;
    }

    if (fromDate === toDate && selectedFromShift > selectedToShift) {
      Alert.alert(
        "Invalid Shift",
        "From Shift must be before To Shift on same date"
      );
      return;
    }

    //await downloadExcelFromBackend();
    await downloadExcel();
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
            Feeding Report In Excel
          </Text>
        </View>
      </View>

      <ScrollView>
        {/*<View
          style={{
            marginTop: hp(15),
            padding: hp(2),
            backgroundColor: "#EFECE3",
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>From</Text>

          <Button
            title="Select From Date"
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
              }}
            />
          )}

          <Picker
            selectedValue={selectedFromShift}
            onValueChange={setSelectedFromShift}
          >
            <Picker.Item label="Select Shift" value="" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>

          <Text style={{ fontSize: wp(5), fontWeight: "bold", marginTop: 10 }}>
            To
          </Text>

          <Button
            title="Select To Date"
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
              }}
            />
          )}

          <Picker
            selectedValue={selectedToShift}
            onValueChange={setSelectedToShift}
          >
            <Picker.Item label="Select Shift" value="" />
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>

          <Button
            title={loading ? "Generating..." : "Get Report"}
            disabled={loading}
            onPress={handleSubmit}
            buttonStyle={{ marginTop: 20 }}
          />
            </View>*/}

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
