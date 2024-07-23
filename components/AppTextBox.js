import { View, Text, TextInput } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AppTextBox = ({
  label,
  labelcolor = "white",
  tbSize = 30,
  lbSize = 40,
  ...otherProps
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: wp(85),
        height: hp(6),
        gap: hp(3),
        marginBottom: hp(1),
        marginTop: hp(1),
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: wp(lbSize),
          backgroundColor: labelcolor,
          height: hp(6),
          justifyContent: "center",
          borderRadius: 25,
          paddingLeft: wp(3),
        }}
      >
        <Text
          style={{
            fontSize: wp(5),
            fontWeight: "bold",
            color: "black",
            textAlign: "left",
          }}
        >
          {label.toUpperCase()}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 25,
          width: wp(tbSize),
          height: hp(6),
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <TextInput
          selectionColor={"black"}
          style={{
            height: hp(6),
            width: wp(30),
            paddingLeft: wp(2),
            fontSize: hp(3),
            fontFamily: "Roboto",
            borderWidth: wp(0.3),
            borderRadius: 10,
            borderColor: "#0c0c0c",
            backgroundColor: "white",
          }}
          keyboardType="number-pad"
          {...otherProps}
        />
      </View>
    </View>
  );
};

export default AppTextBox;
