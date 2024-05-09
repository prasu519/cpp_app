import { View } from "react-native";
import React from "react";
import { Button } from "@rneui/base";

export default function Home({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Button
        title={"Enter Shift Reports"}
        buttonStyle={{ width: 200, height: 100 }}
        titleStyle={{ fontSize: 20, color: "black" }}
        radius={25}
        color="#74E291"
        onPress={() => navigation.navigate("ShiftReportEntry")}
      ></Button>
      <Button
        title={"Add Blend"}
        buttonStyle={{ width: 200, height: 100 }}
        titleStyle={{ fontSize: 25, color: "black" }}
        radius={25}
        color="#FF8080"
        onPress={() => navigation.navigate("AddBlend")}
      ></Button>
      <Button
        title={"View Reports"}
        buttonStyle={{ width: 200, height: 100 }}
        titleStyle={{ fontSize: 25, color: "black" }}
        radius={25}
        onPress={() => navigation.navigate("ViewReports")}
      ></Button>
    </View>
  );
}
