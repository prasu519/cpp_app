import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import AppTextBox from "../components/AppTextBox";
import { AntDesign } from "@expo/vector-icons";
import AppFormButton from "../components/AppFormButton";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";
import shift from "../utils/Shift";
import BaseUrl from "../config/BaseUrl";
import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FieldSet from "react-native-fieldset";
import { GlobalContext } from "../contextApi/GlobalContext";

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
  const { feedingData, setFeedingData } = useContext(GlobalContext);

  const currentDate = new Date().toISOString().split("T")[0];
  const currentShift = shift(new Date().getHours());

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
    /*   setProgress(0);
    setDoneScreen(true);

   await axios
      .post(BaseUrl + "/feeding", newValues, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then((response) => console.log(response.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not save data..");
      });
*/
    resetForm();
    setTimeout(() => navigation.goBack(), 1000);
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
                  DATE : {currentDate}
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
                    onChangeText={handleChange("ct1")}
                    onBlur={() => setFieldTouched("ct1")}
                    value={values["ct1"].toString()}
                    maxLength={4}
                    lbSize={30}
                  />
                  <ErrorMessage error={errors.ct1} visible={touched.ct1} />
                  <AppTextBox
                    label="CT-2"
                    labelcolor="orange"
                    onChangeText={handleChange("ct2")}
                    onBlur={() => setFieldTouched("ct2")}
                    value={values["ct2"].toString()}
                    maxLength={4}
                    lbSize={30}
                  />
                  <ErrorMessage error={errors.ct2} visible={touched.ct2} />
                  <AppTextBox
                    label="CT-3"
                    labelcolor="orange"
                    onChangeText={handleChange("ct3")}
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
