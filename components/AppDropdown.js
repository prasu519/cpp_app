import { View, Text } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function AppDropdown({
  id,
  items,
  enable = true,

  ...otherProps
}) {
  return (
    <Picker
      id={id}
      style={{
        width: wp(30),
      }}
      mode="dropdown"
      enabled={enable}
      {...otherProps}
    >
      {items.map((number) => (
        <Picker.Item
          key={number}
          label={number.toString()}
          value={number}
          style={{ fontSize: hp(2.5) }}
        />
      ))}
    </Picker>
  );
}
