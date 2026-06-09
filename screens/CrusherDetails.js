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

export default function CrusherDetails({ navigation }) {
  const formatItem = (str) => {
    const match = str.match(/^([a-zA-Z]+)(\d+)([A-Za-z]+)(\d+)/);
    if (!match) return str;

    const [, prefix, num1, word, num2] = match;
    return `${prefix.slice(0, 2).toUpperCase()}-${num1} ${
      word.charAt(0).toUpperCase() + word.slice(1)
    }-${num2}`;
  };
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
            Crusher details
          </Text>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: hp(15),
            padding: hp(2),
            gap: wp(5),
          }}
        >
          {["34", "35", "36", "37", "38", "201", "202"].map((num, ind) => (
            <Card key={ind}>
              <Card.Title h4 h4Style={{ color: "#6495ED" }}>
                {"Crusher-" + num + ""}
              </Card.Title>
              <Card.Divider />
              <View style={{ marginTop: 10 }}>
                {[
                  "Hammers changed on",
                  "Liner plates feeder1 side changed on",
                  "Liner plates feeder2 side changed on",
                  "Feeder changed on",
                  "Present feeder",
                  "Coal crushed with Present feeder",
                  "Coal crushed with Previous feeder",
                ].map((item, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      flexDirection: "row",

                      gap: hp(1),
                    }}
                  >
                    <View
                      style={{
                        width: wp(40),
                        alignItems: "flex-start",
                        marginBottom: wp(3),
                      }}
                    >
                      <Text style={{ fontSize: wp(4.5), fontWeight: "600" }}>
                        {formatItem(item)}
                      </Text>
                    </View>
                    <Divider orientation="vertical" />
                    <Text
                      style={{
                        fontSize: wp(5),
                        fontWeight: "bold",
                      }}
                    >
                      {/*crusherFeedersTotal[item]*/}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
