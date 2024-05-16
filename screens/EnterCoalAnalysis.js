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

const validationSchema = Yup.object().shape({
  ci: Yup.number()
    .typeError("Crushing Index must be number")
    .required()
    .integer()
    .max(80)
    .label("C.I"),
  ash: Yup.number()
    .typeError("Ash must be number")
    .required()
    .max(13)
    .label("Ash"),
  vm: Yup.number()
    .typeError("Volatile Matter must be number")
    .required()
    .max(30)
    .label("Volatile Matter"),
  fc: Yup.number()
    .typeError("Fixed Carbor must be number")
    .required()
    .max(70)
    .label("Fixed Carbor"),
  tm: Yup.number()
    .typeError("Total moisture must be number")
    .required()
    .max(13)
    .label("Total moisture"),
});

export default function EnterCoalAnalysis({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentDate = new Date().toISOString().split("T")[0];

  /* const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();*/

  const currentShift = shift(new Date().getHours());

  const handleSubmit = async (values, { resetForm }) => {
    let totalOfAVF =
      parseFloat(values.ash) + parseFloat(values.vm) + parseFloat(values.fc);
    console.log(totalOfAVF);
    if (totalOfAVF != 100) {
      alert("Total of Ash,Vm,Fc should be 100..");
      return;
    }

    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/coalAnalysis", values, {
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
            paddingLeft: 10,
            flexDirection: "row",
            alignItems: "center",
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
              color: "#000080",
              alignSelf: "center",
              fontWeight: "bold",
              marginLeft: 25,
            }}
          >
            Enter Coal Analysis
          </Text>
        </View>

        <Formik
          initialValues={{
            date: currentDate,
            shift: currentShift,
            ci: "",
            ash: "",
            vm: "",
            fc: "",
            tm: "",
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
                  gap: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 2,
                }}
              >
                <Text
                  style={{ fontSize: 23, fontWeight: "bold", color: "#000080" }}
                >
                  DATE :{currentDate}
                </Text>
                <Text
                  style={{ fontSize: 23, fontWeight: "bold", color: "#000080" }}
                >
                  SHIFT :{currentShift}
                </Text>
              </View>
              <ScrollView>
                <AppTextBox
                  label="C.I"
                  labelcolor="#6a994e"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={handleChange("ci")}
                  onBlur={() => setFieldTouched("ci")}
                  value={values["ci"]}
                  maxLength={2}
                  placeholder="%"
                />
                <ErrorMessage error={errors.ci} visible={touched.ci} />
                <AppTextBox
                  label="ASH"
                  labelcolor="#6a994e"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={handleChange("ash")}
                  onBlur={() => setFieldTouched("ash")}
                  value={values["ash"]}
                  maxLength={5}
                />
                <ErrorMessage error={errors.ash} visible={touched.ash} />
                <AppTextBox
                  label="V.M"
                  labelcolor="#6a994e"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={handleChange("vm")}
                  onBlur={() => setFieldTouched("vm")}
                  value={values["vm"]}
                  maxLength={5}
                />
                <ErrorMessage error={errors.vm} visible={touched.vm} />
                <AppTextBox
                  label="F.C"
                  labelcolor="#6a994e"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={handleChange("fc")}
                  onBlur={() => setFieldTouched("fc")}
                  value={values["fc"]}
                  maxLength={5}
                />
                <ErrorMessage error={errors.fc} visible={touched.fc} />
                <AppTextBox
                  label="T.M"
                  labelcolor="#6a994e"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={handleChange("tm")}
                  onBlur={() => setFieldTouched("tm")}
                  value={values["tm"]}
                  maxLength={5}
                />
                <ErrorMessage error={errors.tm} visible={touched.tm} />

                <AppFormButton buttonText="Submit" />
              </ScrollView>
            </>
          )}
        </Formik>
      </View>
    </>
  );
}
