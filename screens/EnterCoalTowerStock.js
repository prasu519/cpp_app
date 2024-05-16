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
  ct1stock: Yup.number()
    .typeError("Stock must be number")
    .required()
    .integer()
    .max(3600)
    .label("Ct-1"),
  ct2stock: Yup.number()
    .typeError("Stock must be number")
    .required()
    .integer()
    .max(3600)
    .label("Ct-2"),
  ct3stock: Yup.number()
    .typeError("Stock must be number")
    .required()
    .integer()
    .max(3600)
    .label("Ct-3"),
});

export default function EnterFeeding({ navigation, route }) {
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
    const totalStock =
      parseInt(values.ct1stock) +
      parseInt(values.ct2stock) +
      parseInt(values.ct3stock);

    const newValues = {
      ...values,
      total_stock: totalStock,
    };

    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/coaltowerstock", newValues, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then((response) => console.log(response.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not save data..");
        console.log(error);
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
              fontSize: 25,
              color: "#000080",
              alignSelf: "center",
              fontWeight: "bold",
              borderBottomWidth: 2,
            }}
          >
            Enter Coal-Tower Stocks
          </Text>
        </View>

        <Formik
          initialValues={{
            date: currentDate,
            shift: currentShift,
            ct1stock: "",
            ct2stock: "",
            ct3stock: "",
            total_stock: "",
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
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "red",
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                >
                  Enter Coal-Tower Stock
                </Text>
                <AppTextBox
                  label="CT-1 Stock"
                  labelcolor="#6a994e"
                  onChangeText={handleChange("ct1stock")}
                  onBlur={() => setFieldTouched("ct1stock")}
                  value={values["ct1stock"].toString()}
                  maxLength={4}
                />
                <ErrorMessage
                  error={errors.ct1stock}
                  visible={touched.ct1stock}
                />
                <AppTextBox
                  label="CT-2 Stock"
                  labelcolor="#6a994e"
                  onChangeText={handleChange("ct2stock")}
                  onBlur={() => setFieldTouched("ct2stock")}
                  value={values["ct2stock"].toString()}
                  maxLength={4}
                />
                <ErrorMessage
                  error={errors.ct2stock}
                  visible={touched.ct2stock}
                />
                <AppTextBox
                  label="CT-3 Stock"
                  labelcolor="#6a994e"
                  onChangeText={handleChange("ct3stock")}
                  onBlur={() => setFieldTouched("ct3stock")}
                  value={values["ct3stock"].toString()}
                  maxLength={4}
                />
                <ErrorMessage
                  error={errors.ct3stock}
                  visible={touched.ct3stock}
                />
                <AppFormButton buttonText="Submit" />
              </ScrollView>
            </>
          )}
        </Formik>
      </View>
    </>
  );
}
