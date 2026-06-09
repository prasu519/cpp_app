import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import AppFormButton from "../components/AppFormButton";

import shift from "../utils/Shift";
import DoneScreen from "./DoneScreen";
import FieldSet from "react-native-fieldset";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";
import { Button } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EnterCrusherDetails({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setPushingScheduleData, globalDate, globalShift } =
    useContext(GlobalContext);
  const displayDate = new Date();
  const currentDate = new Date(displayDate).toISOString().split("T")[0];
  const currentShift = shift(new Date().getHours());
  const [crusherName, setCrusherName] = useState();
  const [displayCrDetails, setDisplayCrDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);

  const handleToShowCrDetails = (name) => {
    setCrusherName(name);
    setDisplayCrDetails(true);
  };

  const handleDateChange = (event, date, field) => {
    setShowDatePicker(null);

    if (date) {
      setSelectedDates((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  return (
    <>
      <DoneScreen
        progress={progress}
        onDone={() => setDoneScreen(false)}
        visible={doneScreen}
      />

      <View style={{ flex: 1, gap: 30 }}>
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            height: hp(20),
            width: wp(100),
            backgroundColor: "#2FF3E0",
            borderBottomLeftRadius: hp(8),
            borderBottomRightRadius: hp(8),
          }}
        >
          <View
            style={{
              paddingTop: hp(2),
              paddingLeft: hp(2),
              flexDirection: "row",
              alignItems: "center",
              gap: wp(5),
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
              Enter Crusher Details
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: hp(8),
              paddingTop: hp(3),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: "bold",
                color: "#DF362D",
              }}
            >
              DATE : {FormatDate(displayDate)}
            </Text>
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: "bold",
                color: "#DF362D",
              }}
            >
              SHIFT : {currentShift}
            </Text>
          </View>
        </View>

        <ScrollView
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: hp(20),
            padding: hp(2),
          }}
        >
          <View
            style={{
              height: hp(6),
              alignItems: "center",
              width: wp(95),
              flexDirection: "row",
              gap: wp(1.5),
              marginBottom: wp(5),
            }}
          >
            {["CR34", "CR35", "CR36", "CR37", "CR38"].map((val, ind) => (
              <Button
                title={val}
                key={ind}
                buttonStyle={{
                  width: wp(17),
                  height: hp(5),
                  borderRadius: 25,
                  backgroundColor: "#4997d0",
                }}
                titleStyle={{
                  fontSize: hp(1.8),
                  color: "white",
                }}
                onPress={() => handleToShowCrDetails(val)}
              />
            ))}
          </View>

          {displayCrDetails == true ? (
            <>
              <FieldSet label="Crusher Details">
                <>
                  <Text
                    style={{
                      alignSelf: "center",
                      borderBottomWidth: 2,
                      fontSize: hp(2.7),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: hp(3),
                    }}
                  >
                    {crusherName}
                  </Text>
                  <View style={{ flex: 1, gap: 10 }}>
                    {["hcd", "lpf1cd", "lpf2cd", "fcd", "fcs"].map(
                      (dtls, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",

                            alignItems: "center",
                            gap: wp(1),
                          }}
                        >
                          <View
                            style={{
                              width: wp(30),
                              backgroundColor: "#E7E1B1",
                              height: hp(8),
                              justifyContent: "center",
                              borderRadius: 10,
                              paddingLeft: wp(3),
                            }}
                          >
                            <Text
                              style={{
                                fontSize: wp(4.5),

                                color: "black",
                                textAlign: "left",
                              }}
                            >
                              {dtls == "hcd"
                                ? "Hammer Change date"
                                : dtls == "lpf1cd"
                                ? "Liner plates feeder1 side change date"
                                : dtls == "lpf2cd"
                                ? "Liner plates feeder2 side change date"
                                : dtls == "fcd"
                                ? "Feeder change date"
                                : dtls == "fcs"
                                ? "Feeder change shift"
                                : ""}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: wp(2),
                              alignItems: "center",
                              height: hp(8),
                              width: wp(25),
                            }}
                          >
                            <Button
                              title="Select date"
                              buttonStyle={{
                                width: wp(25),
                                height: hp(6),
                                borderRadius: 25,
                                backgroundColor: "#4997d0",
                              }}
                              titleStyle={{
                                fontSize: hp(1.8),
                                color: "white",
                              }}
                              onPress={() => setShowDatePicker(dtls)}
                            />
                            {showDatePicker === dtls && (
                              <DateTimePicker
                                value={selectedDates[dtls] || new Date()}
                                mode="date"
                                display="spinner"
                                onChange={(event, date) =>
                                  handleDateChange(event, date, dtls)
                                }
                              />
                            )}
                            <Text style={{ fontSize: hp(2), color: "red" }}>
                              {selectedDates[dtls]
                                ? selectedDates[dtls]
                                    .toISOString()
                                    .split("T")[0]
                                : ""}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                    <View
                      style={{
                        height: hp(6),
                        width: wp(85),
                        marginTop: hp(4),
                      }}
                    >
                      <Button
                        title="Select date"
                        buttonStyle={{
                          width: wp(25),
                          height: hp(6),
                          borderRadius: 25,
                          backgroundColor: "#4997d0",
                        }}
                        titleStyle={{
                          fontSize: hp(1.8),
                          color: "white",
                        }}
                        onPress={() => setShowDatePicker(dtls)}
                      />
                    </View>
                  </View>
                </>
              </FieldSet>
            </>
          ) : null}
        </ScrollView>
      </View>
    </>
  );
}
