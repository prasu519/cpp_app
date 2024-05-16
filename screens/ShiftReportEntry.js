import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import { Button } from "@rneui/base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ShiftReportEntry({ navigation }) {
  const currentDate = new Date().toISOString().split("T")[0];
  const currentShift = shift(new Date().getHours());

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: hp(20),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(4),
          borderBottomRightRadius: hp(4),
        }}
      >
        <View
          style={{
            paddingTop: hp(5),
            paddingLeft: hp(2),
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
              fontSize: hp(3),
              borderBottomWidth: 2,
              color: "black",
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
            gap: hp(10),
            paddingTop: hp(3),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: hp(2.5), fontWeight: "bold", color: "#DF362D" }}
          >
            DATE : {currentDate}
          </Text>
          <Text
            style={{ fontSize: hp(2.5), fontWeight: "bold", color: "#DF362D" }}
          >
            SHIFT : {currentShift}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            position: "relative",
            zIndex: 1,
            alignItems: "center",
            marginTop: hp(25),
            gap: hp(4),
            marginBottom: hp(5),
          }}
        >
          <Button
            title={"Enter Reclaiming"}
            buttonStyle={{ width: wp(50), height: hp(7) }}
            titleStyle={{
              fontSize: hp(2.5),
              color: "black",
              fontWeight: "bold",
            }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterReclaiming")}
          ></Button>

          <Button
            title={"Enter Feeding"}
            buttonStyle={{ width: wp(40), height: hp(7) }}
            titleStyle={{
              fontSize: hp(2.5),
              color: "black",
              fontWeight: "bold",
            }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterFeeding")}
          ></Button>

          <Button
            title={" Enter Running Hours"}
            buttonStyle={{ width: wp(60), height: hp(7) }}
            titleStyle={{
              fontSize: hp(2.5),
              color: "black",
              fontWeight: "bold",
            }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterRunningHours")}
          ></Button>

          <Button
            title={"Enter Delays"}
            buttonStyle={{ width: wp(40), height: hp(7) }}
            titleStyle={{
              fontSize: hp(2.5),
              color: "black",
              fontWeight: "bold",
            }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("EnterDelays")}
          ></Button>

          <Button
            title={"Enter MB-Top Stock"}
            buttonStyle={{ width: wp(60), height: hp(7) }}
            titleStyle={{
              fontSize: hp(2.5),
              color: "black",
              fontWeight: "bold",
            }}
            radius={25}
            color="#50C4ED"
            onPress={() => navigation.navigate("BinStock")}
          ></Button>

          <Button
            title="Enter Coal-Tower Stock"
            buttonStyle={{ width: wp(70), height: hp(7) }}
            radius={50}
            color="#50C4ED"
            titleStyle={{
              color: "black",
              fontSize: hp(2.5),
              fontWeight: "bold",
            }}
            onPress={() => navigation.navigate("CoalTowerStock")}
          ></Button>

          <Button
            title="Enter Coal Analysis"
            buttonStyle={{ width: wp(60), height: hp(7) }}
            radius={50}
            color="#50C4ED"
            titleStyle={{
              color: "black",
              fontSize: hp(2.5),
              fontWeight: "bold",
            }}
            onPress={() => navigation.navigate("EnterCoalAnalysis")}
          ></Button>

          <Button
            title="Enter Pushing Schedule"
            buttonStyle={{ width: wp(70), height: hp(7) }}
            radius={50}
            color="#50C4ED"
            titleStyle={{
              color: "black",
              fontSize: hp(2.5),
              fontWeight: "bold",
            }}
            onPress={() => navigation.navigate("PushingSchedule")}
          ></Button>

          <TouchableOpacity
            style={{
              height: hp(7),
              width: wp(40),
              backgroundColor: "#fcbf49",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              marginTop: hp(5),
            }}
            onPress={() =>
              navigation.navigate("Review", {
                date: currentDate,
                shift: currentShift,
              })
            }
          >
            <Text
              style={{ fontSize: hp(2.5), fontWeight: "bold", color: "white" }}
            >
              Review
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: hp(7),
              width: wp(70),
              backgroundColor: "#fc5c65",
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: hp(2.5), fontWeight: "bold", color: "white" }}
            >
              Send Final Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
