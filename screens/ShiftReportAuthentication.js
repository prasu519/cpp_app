import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { FormatDate } from "../utils/FormatDate";
import axios from "axios";

export default function ShiftReportAuthentication({
  visible,
  onClose,
  onSubmit,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [empnum, setEmpnum] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedShift, setSelectedShift] = useState();
  const [shiftReportEnteredBy, setShiftReportEnteredBy] = useState();

  const [loading, setLoading] = useState(false);
  const [presDataChecked, setPresDataChecked] = useState(false);
  const [prevDataChecked, setPrevDataChecked] = useState(false);
  const [presEntryFound, setPresEntryFound] = useState(true);
  const [latestRecord, setLatestRecord] = useState();

  useEffect(() => {
    if (presDataChecked) {
      setPresDataChecked(false);
      if (shiftReportEnteredBy === undefined) {
        if (selectedShift === "A") {
          fdate = new Date(selectedDate);
          fdate.setDate(fdate.getDate() - 1);
          previousDate = fdate.toISOString().split("T")[0];
          getPrevShiftReportEntryDetails(previousDate, "C");
        } else if (selectedShift === "B") {
          fdate = new Date(selectedDate).toISOString().split("T")[0];
          getPrevShiftReportEntryDetails(fdate, "A");
        } else {
          fdate = new Date(selectedDate).toISOString().split("T")[0];
          getPrevShiftReportEntryDetails(fdate, "B");
        }
      } else {
        alert("This Shift report has been submitted already..");
        setPresDataChecked(false);
      }
    }
    if (prevDataChecked) {
      if (shiftReportEnteredBy === undefined) {
        alert("Please enter previous Shift report first..");
      } else {
        onSubmit(empnum, selectedDate, selectedShift);
        setSelectedDate(null);
        setSelectedShift(null);
        setEmpnum(null);
        onClose();
      }
      setPrevDataChecked(false);
    }
  }, [presDataChecked, prevDataChecked]);

  useEffect(() => {
    axios
      .get(BaseUrl + "/shiftreportenteredbylatest")
      .then((response) => {
        setLatestRecord(response.data.data);
      })
      .catch((error) => {
        alert("latest record not found  " + error);
      });
  }, []);

  const getPresShiftReportEntryDetails = async (date, shift) => {
    await axios
      .get(BaseUrl + "/shiftreportenteredby", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => {
        setShiftReportEnteredBy(responce.data.data[0]);
      })
      .catch((error) => console.log(error));
    setPresDataChecked(true);
  };

  const getPrevShiftReportEntryDetails = async (date, shift) => {
    await axios
      .get(BaseUrl + "/shiftreportenteredby", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => {
        setShiftReportEnteredBy(responce.data.data[0]);
      })
      .catch((error) => console.log(error));
    setPrevDataChecked(true);
    setPresEntryFound(true);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (empnum && selectedDate && selectedShift != null) {
      setLoading(true);

      let fdate;
      let previousDate;
      fdate = new Date(selectedDate).toISOString().split("T")[0];
      await getPresShiftReportEntryDetails(fdate, selectedShift);

      if (!presEntryFound) {
        console.log("called");
        if (selectedShift === "A") {
          fdate = new Date(selectedDate);
          fdate.setDate(fdate.getDate() - 1);
          previousDate = fdate.toISOString().split("T")[0];
          await getPrevShiftReportEntryDetails(previousDate, "C");
        } else if (selectedShift === "B") {
          fdate = new Date(selectedDate).toISOString().split("T")[0];
          await getPrevShiftReportEntryDetails(fdate, "A");
        } else {
          fdate = new Date(selectedDate).toISOString().split("T")[0];
          await getPrevShiftReportEntryDetails(fdate, "B");
        }
      }
      setLoading(false);
    } else alert("Select Employee number , Date & Shift");
  };
  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedShift(null);
    setEmpnum(null);
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: 300,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              borderBottomWidth: 1,
              color: "brown",
              marginBottom: hp(2),
            }}
          >
            Enter Employe Number:
          </Text>
          <TextInput
            style={{
              width: "100%",
              padding: wp(2),
              borderWidth: 1,
              borderRadius: 5,
            }}
            placeholder="Type here..."
            onChangeText={setEmpnum}
            keyboardType="number-pad"
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: hp(2),
              borderBottomWidth: 1,
              color: "brown",
            }}
          >
            Select Report Date and Shift:
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: wp(6),
              alignItems: "center",
              height: hp(5),
              width: wp(55),
              marginBottom: hp(1),
            }}
          >
            <Button
              title="Select date"
              buttonStyle={{ width: wp(23), height: hp(5) }}
              titleStyle={{
                fontSize: hp(1.6),
                color: "white",
                borderBottomWidth: 2,
                borderBottomColor: "white",
              }}
              radius={25}
              onPress={() => setShowDatePicker(true)}
            />

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            <Text style={{ fontSize: hp(2) }}>{FormatDate(selectedDate)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: wp(5),
              alignItems: "center",
              height: hp(5),
              width: wp(63),
              marginBottom: hp(2),
            }}
          >
            <Text
              style={{
                fontSize: wp(5),
                alignSelf: "left",
                fontWeight: "bold",
                color: "#0074B7",
                marginLeft: hp(2),
              }}
            >
              Select Shift
            </Text>

            <Picker
              id="Shift"
              style={{
                width: wp(25),
              }}
              mode="dropdown"
              enabled={true}
              onValueChange={setSelectedShift}
              selectedValue={selectedShift}
            >
              {[" ", "A", "B", "C"].map((shift) => (
                <Picker.Item
                  key={shift}
                  label={shift.toString()}
                  value={shift}
                  style={{ fontSize: hp(2) }}
                />
              ))}
            </Picker>
          </View>

          {latestRecord && (
            <View
              style={{
                height: hp(10),
                width: wp(60),
                alignItems: "center",
                justifyContent: "center",
                marginBottom: wp(3),
              }}
            >
              <Text style={{ fontSize: hp(2), color: "red" }}>
                Last Record uploaded on..
              </Text>
              <Text style={{ fontSize: hp(2) }}>
                {FormatDate(new Date(latestRecord.date))}
              </Text>
              <Text style={{ fontSize: hp(2) }}>{latestRecord.shift}</Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button
              title="Enter Report"
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
