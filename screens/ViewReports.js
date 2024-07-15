import { View, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import axios from "axios";
import { Text, Divider } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { FormatDate } from "../utils/FormatDate";

export default function ViewReports({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: hp(15),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View
          style={{
            paddingTop: hp(5),
            paddingLeft: hp(2),
            flexDirection: "row",
            alignItems: "center",
            gap: wp(15),
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
            View Reports
          </Text>
        </View>
      </View>
      <View
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: hp(15),
          padding: hp(2),
          gap: wp(2),
        }}
      >
        <Button
          title={"Shift Report"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            alignSelf: "center",
          }}
          radius={20}
          titleStyle={{
            fontSize: hp(2),
            fontWeight: "600",
          }}
          onPress={() => {
            navigation.navigate("ShiftReportView");
          }}
        />
        <Button
          title={"Day Report"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            alignSelf: "center",
          }}
          radius={20}
          titleStyle={{
            fontSize: hp(2),
            fontWeight: "600",
          }}
          onPress={() => {
            navigation.navigate("DayReportView");
          }}
        />
        <Button
          title={"Blend Report"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            alignSelf: "center",
          }}
          radius={20}
          titleStyle={{
            fontSize: hp(2),
            fontWeight: "600",
          }}
        />
      </View>
    </View>
  );
}
