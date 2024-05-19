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
import FieldSet from "react-native-fieldset";
import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";

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

export default function EnterCoalTowerStock({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { coalTowerStockData, setCoalTowerStockData } =
    useContext(GlobalContext);

  const currentDate = new Date().toISOString().split("T")[0];
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
    setCoalTowerStockData(newValues);
    /* setProgress(0);
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
      });*/
    resetForm();
  };

  return (
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
                  Enter Coal-Tower Stock
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
              <FieldSet label="New Blend">
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
                    Coal-Tower Stock
                  </Text>
                  {[1, 2, 3].map((item, index) => (
                    <View key={index}>
                      <AppTextBox
                        label={"CT - " + item}
                        labelcolor="orange"
                        onChangeText={handleChange("ct" + item + "stock")}
                        onBlur={() => setFieldTouched("ct" + item + "stock")}
                        value={values["ct" + item + "stock"].toString()}
                        maxLength={4}
                      />
                      <ErrorMessage
                        error={errors["ct" + item + "stock"]}
                        visible={touched["ct" + item + "stock"]}
                      />
                    </View>
                  ))}

                  <AppFormButton buttonText="Submit" />
                </>
              </FieldSet>
            </ScrollView>
          </View>
        </>
      )}
    </Formik>
  );
}
