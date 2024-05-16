import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";

import AppTextBox from "../components/AppTextBox";
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

  const currentDate = new Date().toISOString().split("T")[0];
  /* new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();*/

  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    const getCoalNames = async () => {
      await axios
        .get(BaseUrl + "/blend", {
          params: {
            date: currentDate,
            shift: currentShift,
          },
        })
        .then((response) => {
          setCoalNames(response.data.data[0]);
          setCount(response.data.data[0].total);
        })
        .catch((error) => console.log(error));
    };
    getCoalNames();
    console.log(coalNames);
  }, []);

  const handleSubmit = async (values) => {
    const reclaimRegex = /^[0-9]*$/;
    let coaltotal = 0;

    for (let i = 1; i <= count; i++) {
      if (!reclaimRegex.test(values["coal" + i + "recl"])) {
        return alert("Please enter only numbers in Coal-Wise...");
      }

      if (values["coal" + i + "recl"] === "") {
        values["coal" + i + "recl"] = 0;
      }

      coaltotal = coaltotal + parseInt(values["coal" + i + "recl"]);
    }

    let cc49 = values["cc49recl"];
    let cc50 = values["cc50recl"];
    let cc126 = values["cc126recl"];

    if (
      !reclaimRegex.test(cc49) ||
      !reclaimRegex.test(cc50) ||
      !reclaimRegex.test(cc126)
    ) {
      return alert("Please enter only numbers in Stream-Wise...");
    }

    if (cc49 === "") {
      values["cc49recl"] = 0;
    }
    if (cc50 === "") {
      values["cc50recl"] = 0;
    }
    if (cc126 === "") {
      values["cc126recl"] = 0;
    }

    let streamtotal =
      parseInt(values.cc49recl) +
      parseInt(values.cc50recl) +
      parseInt(values.cc126recl);

    if (coaltotal !== streamtotal) {
      return alert("CoalTotal and StreamTotal should be equal..");
    }

    if (coaltotal === 0 && streamtotal === 0) {
      for (let i = 1; i <= count; i++) {
        values["coal" + i + "recl"] = "";
      }
      values["cc49recl"] = "";
      values["cc50recl"] = "";
      values["cc126recl"] = "";

      return alert("Enter Reclaiming Data before submitting...");
    }

    let newValues = {
      ...values,
      coal1name: coalNames.cn1 ? coalNames.cn1 : null,
      coal2name: coalNames.cn2 ? coalNames.cn2 : null,
      coal3name: coalNames.cn3 ? coalNames.cn3 : null,
      coal4name: coalNames.cn4 ? coalNames.cn4 : null,
      coal5name: coalNames.cn5 ? coalNames.cn5 : null,
      coal6name: coalNames.cn6 ? coalNames.cn6 : null,
      coal7name: coalNames.cn7 ? coalNames.cn7 : null,
      coal8name: coalNames.cn8 ? coalNames.cn8 : null,
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
      values["coal" + i + "recl"] = "";
    }
    values["cc49recl"] = "";
    values["cc50recl"] = "";
    values["cc126recl"] = "";
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
            marginTop: 40,
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
              color: "#000080",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Enter Reclaiming
          </Text>
        </View>

        <Formik
          initialValues={{
            date: currentDate,
            shift: currentShift,
            coal1name: "",
            coal1recl: "",
            coal2name: "",
            coal2recl: "",
            coal3name: "",
            coal3recl: "",
            coal4name: "",
            coal4recl: "",
            coal5name: "",
            coal5recl: "",
            coal6name: "",
            coal6recl: "",
            coal7name: "",
            coal7recl: "",
            coal8name: "",
            coal8recl: "",
            cc49recl: "",
            cc50recl: "",
            cc126recl: "",
            total_reclaiming: 0,
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <>
              <View
                style={{
                  flexDirection: "row",
                  gap: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 2,
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", color: "#000080" }}
                >
                  DATE :{currentDate}
                </Text>
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", color: "#000080" }}
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
                      <AppTextBox
                        label={coalNames["cn" + (index + 1)]}
                        labelcolor="orange"
                        key={index}
                        onChangeText={(value) => {
                          if (!/^[0-9]*$/.test(value)) {
                            alert("Enter Numbers only...");
                            return;
                          } else {
                            setFieldValue("coal" + (index + 1) + "recl", value);
                          }
                        }}
                        keyboardType="number-pad"
                        value={values["coal" + (index + 1) + "recl"].toString()}
                        maxLength={4}
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
                    <AppTextBox
                      label={"CC49"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("cc49recl", value);
                        }
                      }}
                      value={values["cc49recl"].toString()}
                      maxLength={4}
                    />

                    <AppTextBox
                      label={"CC50"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("cc50recl", value);
                        }
                      }}
                      value={values["cc50recl"].toString()}
                      maxLength={4}
                    />

                    <AppTextBox
                      label={"CC126"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("cc126recl", value);
                        }
                      }}
                      value={values["cc126recl"].toString()}
                      maxLength={4}
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
