import { View } from "react-native";
import React from "react";
import { Button, Text } from "@rneui/base";

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: "50%",
          width: "100%",
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 80 }}>
          <Text h2>Welcome To CPP</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
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
          color="#E1C340"
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
    </View>
  );
}
