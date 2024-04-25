import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  Pressable,
} from "react-native";
import React from "react";

export default function Home({ navigation }) {
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          alignItems: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          style={{
            height: 100,
            width: "50%",
            backgroundColor: "#74E291",
            borderRadius: 25,
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("ShiftReportEntry")}
        >
          <Text
            style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold" }}
          >
            Enter Shift Report
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{
            height: 100,
            width: "50%",
            backgroundColor: "orange",
            borderRadius: 25,
            justifyContent: "center",
          }}
        >
          <Text
            style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold" }}
          >
            Enter Problems
          </Text>
        </TouchableOpacity>*/}

        <TouchableOpacity
          style={{
            height: 100,
            width: "50%",
            backgroundColor: "#FF8080",
            borderRadius: 25,
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("AddBlend")}
        >
          <Text
            style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold" }}
          >
            Add Blend
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
