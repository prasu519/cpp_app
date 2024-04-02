import { View, Text } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

export default function AppDropdown({ id, items, ...otherProps }) {
  return (
    <Picker
      id={id}
      style={{
        width: 100,
      }}
      mode="dropdown"
      {...otherProps}
    >
      {items.map((number) => (
        <Picker.Item
          key={number}
          label={number.toString()}
          value={number}
          style={{ fontSize: 18 }}
        />
      ))}
    </Picker>
  );
}
