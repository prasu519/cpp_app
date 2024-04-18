import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";

import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import AppDropdown from "../components/AppDropdown";
import AppFormButton from "../components/AppFormButton";
import axios from "axios";
import * as Yup from "yup";
import DoneScreen from "./DoneScreen";

import shift from "../utils/Shift";

const validationSchema = Yup.object().shape({
  str2hrs: Yup.number().required(),
  str2min: Yup.number().required(),
  str3hrs: Yup.number().required(),
  str3min: Yup.number().required(),
  str4hrs: Yup.number().required(),
  str4min: Yup.number().required(),
  cc49hrs: Yup.number().required(),
  cc49min: Yup.number().required(),
  cc50hrs: Yup.number().required(),
  cc50min: Yup.number().required(),
  cc126hrs: Yup.number().required(),
  cc126min: Yup.number().required(),
});

export default function EnterRunningHours({ navigation }) {
  //const [shift, setShift] = useState("X");
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const date =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

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

    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/runningHours", values, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then((responce) => console.log(responce.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not save data..");
      });
    resetForm();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#C7B7A3" }}>
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
            fontSize: 25,
            textDecorationLine: "underline",
            color: "red",
            alignSelf: "center",
            fontWeight: "bold",
          }}
        >
          Enter Running Hours
        </Text>
      </View>
      <ScrollView>
        <Formik
          initialValues={{
            date: date,
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
          //validationSchema={validationSchema}
        >
          {({ handleChange, values, setFieldTouched, touched }) => (
            <>
              <DoneScreen
                progress={progress}
                onDone={() => setDoneScreen(false)}
                visible={doneScreen}
              />

              <View
                style={{
                  flexDirection: "row",
                  gap: 50,
                  paddingTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 2,
                }}
              >
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "red" }}
                >
                  DATE :{date}
                </Text>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "red" }}
                >
                  SHIFT :{currentShift}
                </Text>
              </View>

              <View
                style={{
                  paddingTop: 50,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Enter CPP Running Hours
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  padding: 20,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  Stream-2
                </Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="str2hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.str2hrs}
                    onValueChange={handleChange("str2hrs")}
                    onBlur={() => setFieldTouched("str2hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="str2min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.str2min}
                    onValueChange={handleChange("str2min")}
                    onBlur={() => setFieldTouched("str2min")}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  padding: 5,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  Stream-3
                </Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="str3hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.str3hrs}
                    onValueChange={handleChange("str3hrs")}
                    onBlur={() => setFieldTouched("str3hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="str3min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.str3min}
                    onValueChange={handleChange("str3min")}
                    onBlur={() => setFieldTouched("str3min")}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 40,
                  padding: 20,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  Stream-4
                </Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="str4hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.str4hrs}
                    onValueChange={handleChange("str4hrs")}
                    onBlur={() => setFieldTouched("str4hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="str4min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.str4min}
                    onValueChange={handleChange("str4min")}
                    onBlur={() => setFieldTouched("str4min")}
                  />
                </View>
              </View>

              <View
                style={{
                  paddingTop: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Enter CHP Running Hours
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 75,
                  padding: 20,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>CC-49</Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="cc49hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.cc49hrs}
                    onValueChange={handleChange("cc49hrs")}
                    onBlur={() => setFieldTouched("cc49hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="cc49min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.cc49min}
                    onValueChange={handleChange("cc49min")}
                    onBlur={() => setFieldTouched("cc49min")}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 75,
                  padding: 5,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>CC-50</Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="cc50hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.cc50hrs}
                    onValueChange={handleChange("cc50hrs")}
                    onBlur={() => setFieldTouched("cc50hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="cc50min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.cc50min}
                    onValueChange={handleChange("cc50min")}
                    onBlur={() => setFieldTouched("cc50min")}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 60,
                  padding: 20,
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>CC-126</Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id="cc126hrs"
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={values.cc126hrs}
                    onValueChange={handleChange("cc126hrs")}
                    onBlur={() => setFieldTouched("cc126hrs")}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id="cc126min"
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={values.cc126min}
                    onValueChange={handleChange("cc126min")}
                    onBlur={() => setFieldTouched("cc126min")}
                  />
                </View>
              </View>
              <AppFormButton buttonText="Submit" />
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}
