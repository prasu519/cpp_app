import React, { useState, useContext } from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";

export default function DeleteShiftReportAuthentication({
  visible,
  onClose,
  onSubmit,
}) {
  const [empnum, setEmpnum] = useState();
  const handleCancel = () => {
    setEmpnum(null);
    onClose();
  };
  const handleSubmit = () => {
    if (empnum) {
      onSubmit(empnum);
      setEmpnum(null);
      onClose();
    } else alert("Select Employee number..");
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
              padding: 10,
              borderWidth: 1,
              borderRadius: 5,
              marginBottom: 15,
            }}
            placeholder="Type here..."
            onChangeText={setEmpnum}
            keyboardType="number-pad"
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
