//date
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FormatDate } from "../utils/FormatDate";
import axios from "axios";

export default function ShiftReportAuthentication({
  visible,
  onClose,
  onSubmit,
}) {
  const [empnum, setEmpnum] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedShift, setSelectedShift] = useState();
  const [loading, setLoading] = useState(false);
  const [latestRecord, setLatestRecord] = useState();
  const [latestRecordLoaded, setLatestRecordLoaded] = useState(false);

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
            {!latestRecordLoaded ? (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: hp(1), color: "gray" }}>
                  Loading latest record...
                </Text>
              </View>
            ) : (
              <Button title="Enter Report" onPress={handleSubmit} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
