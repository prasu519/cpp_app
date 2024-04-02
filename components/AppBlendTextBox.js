import { View, Text, TextInput } from "react-native";
import React from "react";

export default function AppBlendTextBox({
  label,
  labelcolor,
  coalName,
  coalPercentage,
  ...otherProps
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "98%",
        height: 50,
        gap: 5,
        marginBottom: 10,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "40%",

          backgroundColor: labelcolor,
          height: 50,
          justifyContent: "center",
          borderRadius: 25,
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
            textAlign: "left",
          }}
        >
          Coal-{label}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 25,
          width: "40%",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <TextInput
          selectionColor={"black"}
          style={{
            height: 50,
            width: "90%",
            paddingLeft: 10,
            fontSize: 30,
            fontFamily: "Roboto",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#0c0c0c",
            backgroundColor: "white",
          }}
          keyboardType="number-pad"
          placeholder="Name"
          onChangeText={coalName}
          {...otherProps}
        />
      </View>
      <View
        style={{
          borderRadius: 25,
          width: "20%",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <TextInput
          selectionColor={"black"}
          style={{
            height: 50,
            width: "90%",
            paddingLeft: 10,
            fontSize: 30,
            fontFamily: "Roboto",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#0c0c0c",
            backgroundColor: "white",
          }}
          keyboardType="number-pad"
          placeholder="%"
          onChangeText={coalPercentage}
          {...otherProps}
        />
      </View>
    </View>
  );
}
