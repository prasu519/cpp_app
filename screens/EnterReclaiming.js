import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";

import AppFormTextBox from "../components/AppFormTextBox";
import axios from "axios";
import AppFormButton from "../components/AppFormButton";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import BaseUrl from "../config/BaseUrl";
import FieldSet from "react-native-fieldset";
import DoneScreen from "./DoneScreen";

export default function EnterReclaiming({ navigation }) {
  const [coalNames, setCoalNames] = useState({});
  const [count, setCount] = useState();
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const date =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    const getCoalNames = async () => {
      await axios
        .get(BaseUrl + "/blend")
        .then((response) => {
          setCoalNames(response.data.data);
          setCount(response.data.data.total);
        })
        .catch((error) => console.log(error));
    };
    getCoalNames();
  }, []);

  const handleSubmit = async (values) => {
    const reclaimRegex = /^[0-9]*$/;
    let coaltotal = 0;

    for (let i = 1; i <= count; i++) {
      if (!reclaimRegex.test(values["coal" + i])) {
        return alert("Please enter only numbers in Coal-Wise...");
      }

      if (values["coal" + i] === "") {
        values["coal" + i] = 0;
      }

      coaltotal = coaltotal + parseInt(values["coal" + i]);
    }

    let cc49 = values["cc49"];
    let cc50 = values["cc50"];
    let cc126 = values["cc126"];

    if (
      !reclaimRegex.test(cc49) ||
      !reclaimRegex.test(cc50) ||
      !reclaimRegex.test(cc126)
    ) {
      return alert("Please enter only numbers in Stream-Wise...");
    }

    if (cc49 === "") {
      values["cc49"] = 0;
    }
    if (cc50 === "") {
      values["cc50"] = 0;
    }
    if (cc126 === "") {
      values["cc126"] = 0;
    }

    let streamtotal =
      parseInt(values.cc49) + parseInt(values.cc50) + parseInt(values.cc126);

    if (coaltotal !== streamtotal) {
      return alert("CoalTotal and StreamTotal should be equal..");
    }

    if (coaltotal === 0 && streamtotal === 0) {
      for (let i = 1; i <= count; i++) {
        values["coal" + i] = "";
      }
      values["cc49"] = "";
      values["cc50"] = "";
      values["cc126"] = "";

      return alert("Enter Reclaiming Data before submitting...");
    }

    let newValues = {
      ...values,
      total_reclaiming: streamtotal,
    };
    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/reclaiming", newValues, {
        onUploadProgress: (progress) =>
          setProgress(progress.loaded / progress.total),
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        setDoneScreen(false);
        alert("Could not save data..");
      });

    for (let i = 1; i <= count; i++) {
      values["coal" + i] = "";
    }
    values["cc49"] = "";
    values["cc50"] = "";
    values["cc126"] = "";
  };

  return (
    <>
      <DoneScreen
        progress={progress}
        onDone={() => setDoneScreen(false)}
        visible={doneScreen}
      />
      <View style={{ flex: 1, backgroundColor: "#89CFF0", gap: 30 }}>
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
              fontSize: 26,
              textDecorationLine: "underline",
              color: "red",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Enter Enter Reclaiming
          </Text>
        </View>

        <Formik
          initialValues={{
            date: date,
            shift: currentShift,
            coal1: "",
            coal2: "",
            coal3: "",
            coal4: "",
            coal5: "",
            coal6: "",
            coal7: "",
            coal8: "",
            cc49: "",
            cc50: "",
            cc126: "",
            total_reclaiming: 0,
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
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
                  DATE :{date}
                </Text>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "red" }}
                >
                  SHIFT :{currentShift}
                </Text>
              </View>
              <ScrollView style={{ padding: 10 }}>
                <FieldSet label="New Blend">
                  <>
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 25,
                        fontWeight: "bold",
                        color: "#416D19",
                      }}
                    >
                      Enter Coal-wise
                    </Text>
                    {Array.from({ length: count }, (_, index) => (
                      <AppFormTextBox
                        label={coalNames["cn" + (index + 1)]}
                        labelcolor="orange"
                        key={index}
                        onChangeText={(text) =>
                          setFieldValue("coal" + (index + 1), text)
                        }
                        keyboardType="number-pad"
                        value={values["coal" + (index + 1)].toString()}
                      />
                    ))}
                    <Text
                      style={{
                        alignSelf: "center",
                        fontSize: 25,
                        fontWeight: "bold",
                        color: "#416D19",
                        paddingTop: 20,
                      }}
                    >
                      Enter Stream-wise
                    </Text>
                    <AppFormTextBox
                      label={"CC49"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(text) => setFieldValue("cc49", text)}
                      value={values["cc49"].toString()}
                    />

                    <AppFormTextBox
                      label={"CC50"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(text) => setFieldValue("cc50", text)}
                      value={values["cc50"].toString()}
                    />

                    <AppFormTextBox
                      label={"CC126"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(text) => setFieldValue("cc126", text)}
                      value={values["cc126"].toString()}
                    />
                    <AppFormButton buttonText="Submit" />
                  </>
                </FieldSet>
              </ScrollView>
            </>
          )}
        </Formik>
      </View>
    </>
  );
}
