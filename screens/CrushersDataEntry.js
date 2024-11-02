import { View, Text, Image } from "react-native";
import React from "react";

export default function CrushersDataEntry() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View>
        <Image
          style={{ height: "40%", width: "100%" }}
          source={require("../assets/Vector1.png")}
        />
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 0 }}>
        <Image
          style={{ height: 350, width: 150 }}
          source={require("../assets/Vector2.png")}
        />
      </View>
    </View>
  );
}
