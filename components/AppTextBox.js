import { View, Text, TextInput } from "react-native";
import React from "react";

const AppTextBox = ({
  label,
  labelcolor,
  tbSize = "40%",
  lbSize = "50%",
  ...otherProps
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "98%",
        height: 50,
        gap: 5,
        marginLeft: 5,
        marginBottom: 10,
        marginTop: 10,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: lbSize,

          backgroundColor: labelcolor,
          height: 50,
          justifyContent: "center",
          borderRadius: 25,
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            fontSize: 25,
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
          width: tbSize,
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
          {...otherProps}
        />
      </View>
    </View>
  );
};

export default AppTextBox;
