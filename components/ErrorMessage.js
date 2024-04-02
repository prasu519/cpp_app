import { View, Text } from "react-native";
import React from "react";

export default function ErrorMessage({ error, visible }) {
  if (!error || !visible) return null;
  return <Text style={{ color: "red", fontSize: 20 }}>{error}</Text>;
}
