import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function AppButton({
  buttonName,
  buttonColour = "#fc5c65",
  width = "90%",
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: buttonColour, //#fc5c65
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: 30,
        width: width,
        marginVertical: 10,
        alignSelf: "center",
      }}
      {...otherProps}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {buttonName}
      </Text>
    </TouchableOpacity>
  );
}
