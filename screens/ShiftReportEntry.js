import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";

export default function ShiftReportEntry({ navigation }) {
  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCAD4" }}>
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
            color: "red",
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
          gap: 80,
          paddingTop: 20,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
          DATE :{currentDate}
        </Text>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
          SHIFT :{currentShift}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 50,
          gap: 50,
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            backgroundColor: "#50C4ED",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("EnterReclaiming")}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Enter Reclaiming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            backgroundColor: "#50C4ED",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("EnterFeeding")}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Enter Feeding
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            backgroundColor: "#50C4ED",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("EnterRunningHours")}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Enter Running Hours
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            backgroundColor: "#50C4ED",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("EnterDelays")}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Enter Delays</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 50,
            width: "70%",
            backgroundColor: "#50C4ED",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("BinStock")}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Enter Bins Stock
          </Text>
        </TouchableOpacity>

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
            backgroundColor: "orange",
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>Final Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
