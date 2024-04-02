import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { useFormikContext } from "formik";

export default function AppFormButton({ buttonText }) {
  const { handleSubmit } = useFormikContext();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fc5c65",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: 30,
        width: "90%",
        marginVertical: 10,
        alignSelf: "center",
      }}
      onPress={handleSubmit}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
