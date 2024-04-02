import { View, Text, ScrollView } from "react-native";
import React from "react";
import AppFormTextBox from "../components/AppFormTextBox";
import { AntDesign } from "@expo/vector-icons";
import AppFormButton from "../components/AppFormButton";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";
import shift from "../utils/Shift";
import BaseUrl from "../config/BaseUrl";

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
  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

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
    await axios
      .post(BaseUrl + "/feeding", newValues)
      .then((response) => console.log(response.data))
      .catch((error) => alert("Could not save data.."));

    resetForm();
  };

  return (
    <View style={{ flex: 1, gap: 30 }}>
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
            fontSize: 30,
            textDecorationLine: "underline",
            color: "red",
            alignSelf: "center",
            fontWeight: "bold",
            marginLeft: 25,
          }}
        >
          Enter Feeding
        </Text>
      </View>

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
            <View
              style={{
                flexDirection: "row",
                gap: 50,

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
            <ScrollView>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                  color: "red",
                  paddingTop: 20,
                }}
              >
                Enter CoalTower-wise
              </Text>
              <AppFormTextBox
                label="CT-1"
                labelcolor="#6a994e"
                onChangeText={handleChange("ct1")}
                onBlur={() => setFieldTouched("ct1")}
                value={values["ct1"].toString()}
              />
              <ErrorMessage error={errors.ct1} visible={touched.ct1} />
              <AppFormTextBox
                label="CT-2"
                labelcolor="#6a994e"
                onChangeText={handleChange("ct2")}
                onBlur={() => setFieldTouched("ct2")}
                value={values["ct2"].toString()}
              />
              <ErrorMessage error={errors.ct2} visible={touched.ct2} />
              <AppFormTextBox
                label="CT-3"
                labelcolor="#6a994e"
                onChangeText={handleChange("ct3")}
                onBlur={() => setFieldTouched("ct3")}
                value={values["ct3"].toString()}
              />
              <ErrorMessage error={errors.ct3} visible={touched.ct3} />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                  color: "red",
                  paddingTop: 20,
                }}
              >
                Enter Stream-wise
              </Text>
              <AppFormTextBox
                label="Stream-1"
                labelcolor="#e9c46a"
                onChangeText={handleChange("stream1")}
                onBlur={() => setFieldTouched("stream1")}
                value={values["stream1"].toString()}
              />
              <ErrorMessage error={errors.stream1} visible={touched.stream1} />
              <AppFormTextBox
                label="Stream-1A"
                labelcolor="#e9c46a"
                onChangeText={handleChange("stream1A")}
                onBlur={() => setFieldTouched("stream1A")}
                value={values["stream1A"].toString()}
              />
              <ErrorMessage
                error={errors.stream1A}
                visible={touched.stream1A}
              />
              <AppFormButton buttonText="Submit" />
            </ScrollView>
          </>
        )}
      </Formik>
    </View>
  );
}
