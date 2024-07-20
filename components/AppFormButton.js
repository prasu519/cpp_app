import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { useFormikContext } from "formik";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function AppFormButton({
  buttonText,
  buttonColour = "#fc5c65",
  ...otherProps
}) {
  const { handleSubmit } = useFormikContext();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: buttonColour,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: hp(2),
        marginTop: hp(4),
        marginBottom: hp(4),
        width: wp(80),
        alignSelf: "center",
      }}
      onPress={handleSubmit}
      {...otherProps}
    >
      <Text
        style={{
          color: "white",
          fontSize: hp(2.5),
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
