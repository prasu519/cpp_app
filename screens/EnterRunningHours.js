import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import AppDropdown from "../components/AppDropdown";
import AppFormButton from "../components/AppFormButton";

import DoneScreen from "./DoneScreen";
import shift from "../utils/Shift";
import FieldSet from "react-native-fieldset";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";

export default function EnterRunningHours({ navigation }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { runningHoursData, setRunningHoursData, globalDate, globalShift } =
    useContext(GlobalContext);

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

  const handleSubmit = async (values, { resetForm }) => {
    if (
      values.str2hrs === "" ||
      values.str2min === "" ||
      values.str3hrs === "" ||
      values.str3min === "" ||
      values.str4hrs === "" ||
      values.str4min === "" ||
      values.cc49hrs === "" ||
      values.cc49min === "" ||
      values.cc50hrs === "" ||
      values.cc50min === "" ||
      values.cc126hrs === "" ||
      values.cc126min === ""
    ) {
      alert("Make sure to enter all values..");
      return;
    }
    if (values.str2hrs < values.cc50hrs) {
      alert("Correct CC50 and Stream2 running hours.. ");
      return;
    }
    if (values.str3hrs < values.cc49hrs) {
      alert("Correct CC49 and Strm3 running hours.. ");
      return;
    }
    if (values.str4hrs < values.cc126hrs) {
      alert("Correct CC126 and Strm4 running hours.. ");
      return;
    }
    setProgress(0);
    setDoneScreen(true);
    setRunningHoursData(values);
    setProgress(1);

    resetForm();
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
    <Formik
      initialValues={{
        date: currentDate,
        shift: currentShift,
        str2hrs: "",
        str2min: "",
        str3hrs: "",
        str3min: "",
        str4hrs: "",
        str4min: "",
        cc49hrs: "",
        cc49min: "",
        cc50hrs: "",
        cc50min: "",
        cc126hrs: "",
        cc126min: "",
      }}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values }) => (
        <>
          <DoneScreen
            progress={progress}
            onDone={() => setDoneScreen(false)}
            visible={doneScreen}
          />
          <View style={{ flex: 1 }}>
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
                  gap: wp(10),
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
                  Enter Running Hours
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
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: "bold",
                    color: "#DF362D",
                  }}
                >
                  DATE : {FormatDate(globalDate)}
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
              <FieldSet>
                <>
                  <Text
                    style={{
                      alignSelf: "center",
                      borderBottomWidth: 2,
                      fontSize: hp(2.5),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: 30,
                    }}
                  >
                    Enter CPP Running Hours
                  </Text>

                  {["2", "3", "4"].map((item, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: hp(4),
                        gap: hp(2),
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          height: hp(6),
                          width: wp(25),
                          backgroundColor: "orange",
                          borderRadius: hp(2),
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: hp(2.5), fontWeight: "bold" }}>
                          {"Strm-" + item}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp(56),
                          backgroundColor: "white",
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 23,
                        }}
                      >
                        <AppDropdown
                          id={"str" + item + "hrs"}
                          items={[
                            "",
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                          ]}
                          selectedValue={values["str" + item + "hrs"]}
                          onValueChange={handleChange("str" + item + "hrs")}
                        />
                        <Text style={{ fontWeight: "900" }}>:</Text>
                        <AppDropdown
                          id={"str" + item + "min"}
                          items={["", "00", "10", "20", "30", "40", "50"]}
                          selectedValue={values["str" + item + "min"]}
                          onValueChange={handleChange("str" + item + "min")}
                        />
                      </View>
                    </View>
                  ))}
                </>
              </FieldSet>
              <FieldSet>
                <>
                  <Text
                    style={{
                      alignSelf: "center",
                      borderBottomWidth: 2,
                      fontSize: hp(2.5),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: 30,
                    }}
                  >
                    Enter CHP Running Hours
                  </Text>

                  {["50", "49", "126"].map((item, index) => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: hp(4),
                        gap: hp(3),
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          height: hp(6),
                          width: wp(23),
                          backgroundColor: "#e9c46a",
                          borderRadius: hp(2),
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: hp(2.5),
                            fontWeight: "bold",
                          }}
                        >
                          {"CC" + item}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp(56),
                          backgroundColor: "white",
                          flexDirection: "row",
                          alignItems: "center",
                          borderRadius: 23,
                        }}
                      >
                        <AppDropdown
                          id={"cc" + item + "hrs"}
                          items={[
                            "",
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                          ]}
                          selectedValue={values["cc" + item + "hrs"]}
                          onValueChange={handleChange("cc" + item + "hrs")}
                        />
                        <Text style={{ fontWeight: "900" }}>:</Text>
                        <AppDropdown
                          id={"cc" + item + "min"}
                          items={["", "00", "10", "20", "30", "40", "50"]}
                          selectedValue={values["cc" + item + "min"]}
                          onValueChange={handleChange("cc" + item + "min")}
                        />
                      </View>
                    </View>
                  ))}
                </>
              </FieldSet>
              <AppFormButton buttonText="Submit" />
            </ScrollView>
          </View>
        </>
      )}
    </Formik>
  );
}
