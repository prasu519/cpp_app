import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";

import FieldSet from "react-native-fieldset";
import { Formik } from "formik";
import axios from "axios";
import AppFormButton from "../components/AppFormButton";
import BaseUrl from "../config/BaseUrl";

import { Picker } from "@react-native-picker/picker";

export default function AddBlend({ navigation }) {
  const [count, setCount] = useState(0);

  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  const handleCount = (value) => {
    setCount(parseInt(value));
  };

  const DisplayBlendForm = (handleChange) => {
    let inputs = [];
    for (let i = 1; i <= count; i++) {
      inputs.push(
        <View style={{ flex: 1 }} key={i}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 70,
              borderRadius: 25,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                height: 60,
                width: "35%",
                borderRadius: 10,
                textAlign: "center",
                textAlignVertical: "center",
                fontSize: 35,
                fontWeight: "bold",
              }}
            >
              Coal-{i}
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                height: 70,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 10,
                gap: 10,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: "white",
                  height: 60,
                  width: "55%",
                  borderRadius: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 35,
                  borderWidth: 1,
                }}
                placeholder="Name"
                onChangeText={handleChange("cn" + i)}
              />
              <TextInput
                style={{
                  backgroundColor: "white",
                  height: 60,
                  width: "25%",
                  borderRadius: 10,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 40,
                  borderWidth: 1,
                }}
                placeholder="%"
                onChangeText={handleChange("cp" + i)}
                inputMode="numeric"
                maxLength={2}
              />
            </View>
          </View>
        </View>
      );
    }

    return inputs;
  };

  const handleSubmit = async (values) => {
    const cnRegex = /^[a-zA-Z]*$/;
    const cpRegex = /^[0-9]*$/;
    let totalPercentage = 0;
    for (let i = 1; i <= count; i++) {
      if (
        values["cn" + i] === undefined ||
        values["cp" + i] === undefined ||
        values["cn" + i] === "" ||
        values["cp" + i] === ""
      ) {
        return alert("Mistakes in Blend entrys..");
      }

      let cname = values["cn" + i].toString();
      if (!cnRegex.test(cname)) {
        return alert("Mistakes in Blend entrys.. ");
      }

      let cpercent = values["cp" + i].toString();
      if (!cpRegex.test(cpercent)) {
        return alert("Mistakes in Blend entrys.. ");
      }

      totalPercentage = totalPercentage + parseInt(cpercent);
    }
    if (totalPercentage != 100) {
      return alert("Total Percentage should be 100%.. ");
    }
    const finalValues = { ...values, total: count.toString() };
    console.log(totalPercentage);
    await axios
      .post(BaseUrl + "/blend", finalValues)
      .then((responce) => console.log(responce.data))
      .catch((error) => console.log(error));
  };

  return (
    <View style={{ flex: 1, gap: 10 }}>
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
          Add New Blend
        </Text>
      </View>

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
      <Formik
        initialValues={{
          date: currentDate,
          shift: currentShift,
          total: count,
        }}
        onSubmit={handleSubmit}
      >
        {({ handleChange }) => (
          <ScrollView style={{ padding: 10 }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: 5,
                  gap: 20,
                  height: 70,
                  width: "100%",
                  backgroundColor: "#4ecdc4",
                  borderRadius: 25,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: "center",
                    fontWeight: "bold",
                  }}
                >
                  Number of Coals :
                </Text>

                <Picker
                  id="coalCount"
                  style={{
                    width: 100,
                    backgroundColor: "white",
                  }}
                  mode="dropdown"
                  onValueChange={handleCount}
                  selectedValue={count}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <Picker.Item
                      key={number}
                      label={number.toString()}
                      value={number}
                      style={{ fontSize: 18 }}
                    />
                  ))}
                </Picker>
              </View>
              {count === 0 ? null : (
                <>
                  <FieldSet label="New Blend">
                    <>
                      {DisplayBlendForm(handleChange)}
                      <AppFormButton buttonText="Add New Blend" />
                    </>
                  </FieldSet>
                </>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}
