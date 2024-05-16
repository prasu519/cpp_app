import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import { Button } from "@rneui/base";

export default function ShiftReportEntry({ navigation }) {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentShift = shift(new Date().getHours());

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingTop: 40,
          paddingLeft: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 40,
        }}
      >
        <AntDesign
          name="leftcircle"
          size={40}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontSize: 25,
            textDecorationLine: "underline",
            color: "#000080",
            alignSelf: "center",
            fontWeight: "bold",
          }}
        >
          Enter Shift Report
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 30,
          paddingTop: 20,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}>
          DATE :{currentDate}
        </Text>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}>
          SHIFT :{currentShift}
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingTop: 50,
            gap: 30,
          }}
        >
          <Button
            title={"Enter Reclaiming"}
            buttonStyle={{ width: 200, height: 50 }}
            titleStyle={{ fontSize: 20, color: "black", fontWeight: "bold" }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterReclaiming")}
          ></Button>

          <Button
            title={"Enter Feeding"}
            buttonStyle={{ width: 200, height: 50 }}
            titleStyle={{ fontSize: 20, color: "black", fontWeight: "bold" }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterFeeding")}
          ></Button>

          <Button
            title={" Enter Running Hours"}
            buttonStyle={{ width: 250, height: 50 }}
            titleStyle={{ fontSize: 20, color: "black", fontWeight: "bold" }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterRunningHours")}
          ></Button>

          <Button
            title={"Enter Delays"}
            buttonStyle={{ width: 200, height: 50 }}
            titleStyle={{ fontSize: 20, color: "black", fontWeight: "bold" }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterDelays")}
          ></Button>

          <Button
            title={"Enter MB-TOP Coal Stock"}
            buttonStyle={{ width: 300, height: 50 }}
            titleStyle={{ fontSize: 18, color: "black", fontWeight: "bold" }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("BinStock")}
          ></Button>

          <Button
            title="Enter Coal-Tower Stock"
            buttonStyle={{ width: 280, height: 50 }}
            radius={50}
            color="#50C4ED"
            titleStyle={{ color: "black", fontSize: 18, fontWeight: "bold" }}
            onPress={() => navigation.navigate("CoalTowerStock")}
          ></Button>

          <Button
            title="Enter Coal Analysis"
            buttonStyle={{ width: 250, height: 50 }}
            radius={50}
            color="#50C4ED"
            titleStyle={{ color: "black", fontSize: 18, fontWeight: "bold" }}
            onPress={() => navigation.navigate("EnterCoalAnalysis")}
          ></Button>

          <Button
            title="Enter Pushing Schedule"
            buttonStyle={{ width: 280, height: 50 }}
            radius={50}
            color="#50C4ED"
            titleStyle={{ color: "black", fontSize: 18, fontWeight: "bold" }}
            onPress={() => navigation.navigate("PushingSchedule")}
          ></Button>

          <TouchableOpacity
            style={{
              height: 50,
              width: "70%",
              backgroundColor: "yellow",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("Review", {
                date: currentDate,
                shift: currentShift,
              })
            }
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 50,
              width: "70%",
              backgroundColor: "red",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              Send Final Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
