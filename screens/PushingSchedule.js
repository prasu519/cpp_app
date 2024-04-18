import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
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
import FieldSet from "react-native-fieldset";

const validationSchema = Yup.object().shape({
  bat1: Yup.number()
    .typeError("pushings must be number")
    .required()
    .integer()
    .max(40)
    .label("Batt-1 pushings"),
  bat2: Yup.number()
    .typeError("pushings must be number")
    .required()
    .integer()
    .max(40)
    .label("Batt-2 pushings"),
  bat3: Yup.number()
    .typeError("pushings must be number")
    .required()
    .integer()
    .max(40)
    .label("Batt-3 pushings"),
  bat4: Yup.number()
    .typeError("pushings must be number")
    .required()
    .integer()
    .max(40)
    .label("Batt-4 pushings"),
  bat5: Yup.number()
    .typeError("pushings must be number")
    .required()
    .integer()
    .max(40)
    .label("Batt-5 pushings"),
});

export default function PushingSchedule({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  const handleSubmit = async (values, { resetForm }) => {
    let ptotal =
      parseInt(values["bat1"]) +
      parseInt(values["bat2"]) +
      parseInt(values["bat3"]) +
      parseInt(values["bat4"]) +
      parseInt(values["bat5"]);
    console.log(ptotal);
    let newValues = { ...values, totalPushings: ptotal };

    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/pushings", newValues, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then((response) => console.log(response.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not save data..");
      });

    resetForm();
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
            paddingTop: 40,
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
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
              fontSize: 28,
              textDecorationLine: "underline",
              color: "red",
              alignSelf: "center",
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Enter Pushing Schedule
          </Text>
        </View>

        <Formik
          initialValues={{
            date: currentDate,
            shift: currentShift,
            bat1: "",
            bat2: "",
            bat3: "",
            bat4: "",
            bat5: "",
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
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "red" }}
                >
                  DATE :{currentDate}
                </Text>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "red" }}
                >
                  SHIFT :{currentShift}
                </Text>
              </View>
              <ScrollView style={{ padding: 10 }}>
                <FieldSet label="New Blend">
                  <View style={{ flex: 1, gap: 10 }}>
                    {[1, 2, 3, 4, 5].map((batt, index) => (
                      <View key={index}>
                        <AppTextBox
                          label={"Batt-" + batt}
                          labelcolor="#6a994e"
                          tbSize="20%"
                          onChangeText={handleChange("bat" + batt)}
                          onBlur={() => setFieldTouched("bat" + batt)}
                          value={values["bat" + batt]}
                          maxLength={2}
                        />

                        <ErrorMessage
                          error={errors["bat" + batt]}
                          visible={touched["bat" + batt]}
                        />
                      </View>
                    ))}

                    <AppFormButton buttonText="Submit" />
                  </View>
                </FieldSet>
              </ScrollView>
            </>
          )}
        </Formik>
      </View>
    </>
  );
}
