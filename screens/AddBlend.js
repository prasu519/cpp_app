import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import moment from "moment-timezone";

import FieldSet from "react-native-fieldset";
import { Formik } from "formik";
import axios from "axios";
import AppFormButton from "../components/AppFormButton";
import BaseUrl from "../config/BaseUrl";
import { Picker } from "@react-native-picker/picker";
import DoneScreen from "./DoneScreen";
import { date } from "yup";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FormatDate } from "../utils/FormatDate";
import { GlobalContext } from "../contextApi/GlobalContext";

export default function AddBlend({ navigation }) {
  const [count, setCount] = useState(0);
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { credentials, setCredentials } = useContext(GlobalContext);

  const displayDate = new Date();
  /* let blendDate = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");*/
  const blendDate = new Date().toISOString().split("T")[0];

  const currentShift = shift(new Date().getHours());

  const handleCount = (value) => {
    setCount(parseInt(value));
    //console.log(currentDate);
  };

  const DisplayBlendForm = (handleChange) => {
    let inputs = [];
    for (let i = 1; i <= count; i++) {
      inputs.push(
        <View style={{ flex: 1 }} key={i}>
          <View
            style={{
              flexDirection: "row",
              width: wp(85),
              height: hp(9),
              borderRadius: 25,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                height: hp(5),
                width: wp(30),
                borderRadius: 10,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: hp(3),
                fontWeight: "bold",
                backgroundColor: "orange",
              }}
            >
              Coal-{i}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                height: hp(10),
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "flex-end",
                gap: wp(4),
              }}
            >
              <TextInput
                style={{
                  backgroundColor: "white",
                  height: hp(6),
                  width: wp(35),
                  borderRadius: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: hp(3),
                  borderWidth: 1,
                }}
                placeholder="Name"
                onChangeText={handleChange("cn" + i)}
              />
              <TextInput
                style={{
                  backgroundColor: "white",
                  height: 60,
                  width: wp(15),
                  borderRadius: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: hp(4),
                  borderWidth: 1,
                }}
                placeholder="%"
                onChangeText={handleChange("cp" + i)}
                inputMode="numeric"
                maxLength={2}
              />
            </View>
          </View>
        </View>
      );
    }

    return inputs;
  };

  const handleSubmit = async (values) => {
    const cnRegex = /^[a-zA-Z]*$/;
    const cpRegex = /^[0-9]*$/;
    let totalPercentage = 0;
    for (let i = 1; i <= count; i++) {
      if (
        values["cn" + i] === undefined ||
        values["cp" + i] === undefined ||
        values["cn" + i] === "" ||
        values["cp" + i] === ""
      ) {
        return alert("Mistakes in Blend entrys..");
      }

      let cname = values["cn" + i].toString();
      if (!cnRegex.test(cname)) {
        return alert("Mistakes in Blend entrys.. ");
      }

      let cpercent = values["cp" + i].toString();
      if (!cpRegex.test(cpercent)) {
        return alert("Mistakes in Blend entrys.. ");
      }

      totalPercentage = totalPercentage + parseInt(cpercent);
    }
    if (totalPercentage != 100) {
      return alert("Total Percentage should be 100%.. ");
    }
    const finalValues = { ...values, total: count.toString() };
    setProgress(0);
    setDoneScreen(true);
    await axios
      .post(BaseUrl + "/blend", finalValues, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then((responce) => console.log(responce.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not save data..");
      });
    setCount(0);
    console.log(finalValues);
  };

  return (
    <Formik
      initialValues={{
        date: blendDate,
        shift: currentShift,
        empnum: credentials.empnum,
        total: count,
      }}
      onSubmit={handleSubmit}
    >
      {({ handleChange }) => (
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
                height: hp(25),
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
                  gap: wp(20),
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
                  Add Blend
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
              <View
                style={{
                  height: hp(3),
                  width: wp(60),
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: hp(2),
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: "bold",
                    color: "#DF362D",
                  }}
                >
                  Emp No : {credentials.empnum}
                </Text>
              </View>
            </View>
            <ScrollView
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: hp(26),
                padding: hp(2),
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    height: hp(9),
                    width: "100%",
                    backgroundColor: "#4ecdc4",
                    borderRadius: 25,
                    alignItems: "center",
                    marginBottom: hp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Number of Coals :
                  </Text>

                  <Picker
                    id="coalCount"
                    style={{
                      width: 100,

                      backgroundColor: "white",
                    }}
                    mode="dropdown"
                    onValueChange={handleCount}
                    selectedValue={count}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                      <Picker.Item
                        key={number}
                        label={number.toString()}
                        value={number}
                        style={{ fontSize: 15 }}
                      />
                    ))}
                  </Picker>
                </View>
                {count === 0 ? null : (
                  <>
                    <FieldSet label="New Blend">
                      <>{DisplayBlendForm(handleChange)}</>
                    </FieldSet>
                    <AppFormButton buttonText="Add New Blend" />
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </Formik>
  );
}
