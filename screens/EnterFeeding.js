import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import AppTextBox from "../components/AppTextBox";
import { AntDesign } from "@expo/vector-icons";
import AppFormButton from "../components/AppFormButton";
import { Formik } from "formik";
import * as Yup from "yup";

import ErrorMessage from "../components/ErrorMessage";
import shift from "../utils/Shift";

import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FieldSet from "react-native-fieldset";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";

const validationSchema = Yup.object().shape({
  ct1: Yup.number()
    .typeError("Feeding must be number")
    .required()
    .integer()
    .max(3000)
    .label("Ct-1"),
  ct2: Yup.number()
    .typeError("Feeding must be number")
    .required()
    .integer()
    .max(3000)
    .label("Ct-2"),
  ct3: Yup.number()
    .typeError("Feeding must be number")
    .required()
    .integer()
    .max(3000)
    .label("Ct-3"),
  stream1: Yup.number()
    .typeError("Feeding must be number")
    .required()
    .integer()
    .max(5000)
    .label("Stream1"),
  stream1A: Yup.number()
    .typeError("Feeding must be number")
    .required()
    .integer()
    .max(5000)
    .label("Stream1A"),
});

export default function EnterFeeding({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedingCount, setFeedingCount] = useState(0);
  const { feedingData, setFeedingData, globalDate, globalShift } =
    useContext(GlobalContext);

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

  const handleSubmit = async (values, { resetForm }) => {
    const totalFeeding =
      parseInt(values.ct1) + parseInt(values.ct2) + parseInt(values.ct3);
    const streamTotal = parseInt(values.stream1) + parseInt(values.stream1A);
    if (totalFeeding !== streamTotal) {
      alert("Coal Tower total and Stream total should be equal..");
      return;
    }
    const newValues = {
      ...values,
      total_feeding: totalFeeding,
    };

    setProgress(0);
    setDoneScreen(true);
    setFeedingData(newValues);
    setProgress(1);

    resetForm();
    setTimeout(() => navigation.goBack(), 1000);
  };

  const calculateTotalFeeding = (values) => {
    const total =
      (parseInt(values.ct1) || 0) +
      (parseInt(values.ct2) || 0) +
      (parseInt(values.ct3) || 0);
    setFeedingCount(total);
  };

  return (
    <Formik
      initialValues={{
        date: currentDate,
        shift: currentShift,
        ct1: "",
        ct2: "",
        ct3: "",
        stream1: "",
        stream1A: "",

        total_feeding: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        errors,
        setFieldTouched,
        setFieldValue,
        touched,
        values,
      }) => (
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
                  Enter Feeding
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
                      fontSize: hp(2.7),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: hp(3),
                    }}
                  >
                    Enter CoalTower-wise
                  </Text>
                  <AppTextBox
                    label="CT-1"
                    labelcolor="orange"
                    onChangeText={(text) => {
                      handleChange("ct1")(text);
                      setFieldValue("ct1", text, false);
                      calculateTotalFeeding({ ...values, ct1: text });
                    }}
                    onBlur={() => setFieldTouched("ct1")}
                    value={values["ct1"].toString()}
                    maxLength={4}
                    lbSize={30}
                  />
                  <ErrorMessage error={errors.ct1} visible={touched.ct1} />
                  <AppTextBox
                    label="CT-2"
                    labelcolor="orange"
                    onChangeText={(text) => {
                      handleChange("ct2")(text);
                      setFieldValue("ct2", text, false);
                      calculateTotalFeeding({ ...values, ct2: text });
                    }}
                    onBlur={() => setFieldTouched("ct2")}
                    value={values["ct2"].toString()}
                    maxLength={4}
                    lbSize={30}
                  />
                  <ErrorMessage error={errors.ct2} visible={touched.ct2} />
                  <AppTextBox
                    label="CT-3"
                    labelcolor="orange"
                    onChangeText={(text) => {
                      handleChange("ct3")(text);
                      setFieldValue("ct3", text, false);
                      calculateTotalFeeding({ ...values, ct3: text });
                    }}
                    onBlur={() => setFieldTouched("ct3")}
                    value={values["ct3"].toString()}
                    maxLength={4}
                    lbSize={30}
                  />
                  <ErrorMessage error={errors.ct3} visible={touched.ct3} />
                </>
              </FieldSet>

              <FieldSet>
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        alignSelf: "left",

                        fontSize: hp(2.7),
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: 10,
                      }}
                    >
                      Total Feeding :
                    </Text>
                    <Text
                      style={{
                        alignSelf: "left",

                        fontSize: hp(2.7),
                        fontWeight: "bold",
                        color: "black",
                        marginBottom: wp(3),
                        marginLeft: wp(10),
                      }}
                    >
                      {feedingCount}
                    </Text>
                  </View>
                </>
              </FieldSet>

              <FieldSet>
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
                    Enter Stream-wise
                  </Text>
                  <AppTextBox
                    label="Stream-1"
                    labelcolor="#e9c46a"
                    onChangeText={handleChange("stream1")}
                    onBlur={() => setFieldTouched("stream1")}
                    value={values["stream1"].toString()}
                    maxLength={4}
                    lbSize={45}
                  />
                  <ErrorMessage
                    error={errors.stream1}
                    visible={touched.stream1}
                  />
                  <AppTextBox
                    label="Stream-1A"
                    labelcolor="#e9c46a"
                    onChangeText={handleChange("stream1A")}
                    onBlur={() => setFieldTouched("stream1A")}
                    value={values["stream1A"].toString()}
                    maxLength={4}
                    lbSize={45}
                  />
                  <ErrorMessage
                    error={errors.stream1A}
                    visible={touched.stream1A}
                  />
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
