import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function AppButton({
  buttonName,
  buttonColour = "#fc5c65",
  width = 80,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: buttonColour,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: hp(2),
        marginTop: hp(4),
        width: wp(width),
        marginBottom: hp(4),
        alignSelf: "center",
      }}
      {...otherProps}
    >
      <Text
        style={{
          color: "white",
          fontSize: hp(2),
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {buttonName}
      </Text>
    </TouchableOpacity>
  );
}
