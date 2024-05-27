import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button } from "react-native";

export default function ShiftReportAuthentication({
  visible,
  onClose,
  onSubmit,
}) {
  const [empnum, setEmpnum] = useState();
  const handleSubmit = () => {
    onSubmit(empnum);
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
              marginBottom: 15,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
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
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
