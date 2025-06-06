//date
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
  const [latestRecordLoaded, setLatestRecordLoaded] = useState(false);

  /* useEffect(() => {
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
        let nextdate = new Date(latestRecord.date);
        nextdate.setDate(nextdate.getDate() + 1);

        if (latestRecord.shift === "C") {
          onSubmit(empnum, nextdate, "A");
        } else if (latestRecord.shift === "B") {
          onSubmit(empnum, latestRecord.date, "C");
        } else {
          onSubmit(empnum, latestRecord.date, "B");
        }

        setSelectedDate(null);
        setSelectedShift(null);
        setEmpnum(null);
        onClose();
      }
      setPrevDataChecked(false);
    }
  }, [presDataChecked, prevDataChecked]);*/

  useEffect(() => {
    const getLatestRecord = async () => {
      await axios
        .get(BaseUrl + "/shiftreportenteredbylatest")
        .then((response) => {
          setLatestRecord(response.data.data);
          setLatestRecordLoaded(true);
        })
        .catch((error) => {
          alert("latest record not found  " + error);
        });
    };
    getLatestRecord();
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
    if (empnum != null) {
      setLoading(true);

      let presdate = new Date(latestRecord.date);
      presdate.setDate(presdate.getDate());
      let nextdate = new Date(latestRecord.date);
      nextdate.setDate(nextdate.getDate() + 1);

      if (latestRecord.shift === "C") {
        onSubmit(empnum, nextdate, "A");
      } else if (latestRecord.shift === "B") {
        onSubmit(empnum, presdate, "C");
      } else {
        onSubmit(empnum, presdate, "B");
      }

      setSelectedDate(null);
      setSelectedShift(null);
      setEmpnum(null);
      onClose();

      /* let fdate;
      let previousDate;
      fdate = new Date(selectedDate).toISOString().split("T")[0];
      await getPresShiftReportEntryDetails(fdate, selectedShift);

      if (!presEntryFound) {
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
      }*/
      setLoading(false);
    } else alert("Enter Employee number.. ");
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
              marginBottom: hp(2),
            }}
            placeholder="Type here..."
            onChangeText={setEmpnum}
            keyboardType="number-pad"
          />

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
              disabled={!latestRecordLoaded}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
