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
import FieldSet from "react-native-fieldset";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";

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
    .max(12)
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
    .max(12)
    .label("Total moisture"),
});

export default function EnterCoalAnalysis({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { coalAnalysisData, setCoalAnalysisData, globalDate, globalShift } =
    useContext(GlobalContext);

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

  const handleSubmit = async (values, { resetForm }) => {
    let totalOfAVF =
      parseFloat(values.ash) + parseFloat(values.vm) + parseFloat(values.fc);
    if (totalOfAVF != 100) {
      alert("Total of Ash,Vm,Fc should be 100..");
      return;
    }
    setProgress(0);
    setDoneScreen(true);
    setCoalAnalysisData(values);
    setProgress(1);

    resetForm();
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
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
                  Enter Coal Analysis
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
                    Enter Coal Analysis
                  </Text>
                  {["ci", "ash", "vm", "fc", "tm"].map((item, index) => (
                    <View key={index}>
                      <AppTextBox
                        label={item}
                        labelcolor="orange"
                        tbSize="30%"
                        lbSize="30%"
                        onChangeText={handleChange(item)}
                        onBlur={() => setFieldTouched(item)}
                        value={values[item]}
                        maxLength={item === "ci" ? 2 : 5}
                        placeholder={item === "ci" ? "%" : ""}
                      />
                      <ErrorMessage
                        error={errors[item]}
                        visible={touched[item]}
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
