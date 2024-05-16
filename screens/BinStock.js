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

export default function BinStock({ navigation }) {
  const [coalNames, setCoalNames] = useState({});
  const [count, setCount] = useState();
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
  }, []);

  const handleSubmit = async (values) => {
    let TotalStock = 0;

    for (let i = 1; i <= count; i++) {
      if (values["coal" + i + "stock"] === "") {
        alert("Enter all fields..");
        return;
      } else TotalStock = TotalStock + parseInt(values["coal" + i + "stock"]);
    }

    let newValues = {
      ...values,
      coal1name: coalNames.cn1,
      coal2name: coalNames.cn2,
      coal3name: coalNames.cn3,
      coal4name: coalNames.cn4,
      coal5name: coalNames.cn5,
      coal6name: coalNames.cn6,
      coal7name: coalNames.cn7,
      coal8name: coalNames.cn8,
      total_stock: TotalStock,
    };

    setProgress(0);
    setDoneScreen(true);

    await axios
      .post(BaseUrl + "/mbtopStock", newValues, {
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
      values["coal" + i + "stock"] = "";
    }
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
            gap: 25,
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
            Enter MB-Top Stocks
          </Text>
        </View>

        <Formik
          initialValues={{
            date: currentDate,
            shift: currentShift,
            coal1name: "",
            coal1stock: "",
            coal2name: "",
            coal2stock: "",
            coal3name: "",
            coal3stock: "",
            coal4name: "",
            coal4stock: "",
            coal5name: "",
            coal5stock: "",
            coal6name: "",
            coal6stock: "",
            coal7name: "",
            coal7stock: "",
            coal8name: "",
            coal8stock: "",
            total_stock: 0,
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
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
                  style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}
                >
                  DATE :{currentDate}
                </Text>
                <Text
                  style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}
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
                            setFieldValue(
                              "coal" + (index + 1) + "stock",
                              value
                            );
                          }
                        }}
                        keyboardType="number-pad"
                        value={values["coal" + (index + 1) + "stock"]}
                        maxLength={4}
                      />
                    ))}
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
