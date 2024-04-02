import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import DelayMessageComponent from "../components/DelayMessageComponent";
import AppButton from "../components/AppButton";
import FieldSet from "react-native-fieldset";
import { Formik } from "formik";
import { date } from "yup";
import axios from "axios";
import BaseUrl from "../config/BaseUrl";

export default function EnterDelays({ navigation }) {
  const [DelayComponent, setDelayComponent] = useState([""]);
  const [count, setCount] = useState(1);
  const [myInitialValues, setMyInitialValues] = useState({});
  const [delays, setDelays] = useState([{}]);

  const handleInitialiseValues = () => {
    console.log(count);
    myInitialValues[`fromhr${count}`] = "0";
    myInitialValues[`frommin${count}`] = "00";
    myInitialValues[`tohr${count}`] = "0";
    myInitialValues[`tomin${count}`] = "00";
    myInitialValues[`desc${count}`] = "";
    myInitialValues[`date`] = currentDate;
    myInitialValues[`shift`] = currentShift;
    console.log(myInitialValues);
  };

  useEffect(() => {
    handleInitialiseValues();
  }, [count]);

  const handleAddDelayComponent = () => {
    setDelayComponent([...DelayComponent, ""]);
    setCount(count + 1);
  };
  /* const newInitialValues = { ...initialValues };
    newInitialValues[`fromhr${count}`] = ""; // You can set default value here if needed
    newInitialValues[`frommin${count}`] = ""; // You can set default value here if needed
    newInitialValues[`tohr${count}`] = ""; // You can set default value here if needed
    newInitialValues[`tomin${count}`] = ""; // You can set default value here if needed
    setInitialValues(newInitialValues);
  };*/

  const handleDelete = (index) => {
    const updatedDelayComponents = DelayComponent.filter((_, i) => i !== index);
    setDelayComponent(updatedDelayComponents);
    setCount(count - 1);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    for (let i = 0; i < count; i++) {
      delays[i] = {
        date: currentDate,
        shift: currentShift,
        fromTime:
          values["fromhr" + (i + 1)] + ":" + values["frommin" + (i + 1)],
        toTime: values["tohr" + (i + 1)] + ":" + values["tomin" + (i + 1)],
        reason: values["desc" + (i + 1)],
      };
      console.log(delays);
    }

    /* for (let i = 0; i < count; i++) {
      await axios
        .post(BaseUrl + "/shiftdelay", delays[i])
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
      console.log(delays[i]);
    }*/
  };

  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  const finalValues = {
    ...myInitialValues,
    date: currentDate,
    shift: currentShift,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFCAD4", paddingBottom: 10 }}>
      <View
        style={{
          paddingTop: 40,
          paddingLeft: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 80,
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
          Enter Delays
        </Text>
      </View>
      <Formik initialValues={myInitialValues} onSubmit={handleSubmit}>
        {({ handleSubmit, setFieldValue, values }) => (
          <>
            <View
              style={{
                flexDirection: "row",
                gap: 80,
                paddingTop: 20,
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

            <ScrollView style={{ padding: 10 }}>
              <FieldSet>
                <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
                  {DelayComponent.map((value, index) => (
                    <DelayMessageComponent
                      key={index}
                      slno={index + 1}
                      onDelete={() => handleDelete(index)}
                      selectedValueFromHr={
                        values["fromhr" + (index + 1).toString()]
                      }
                      onSelectFromHr={(value) => {
                        // setFieldValue("fromhr" + (index + 1).toString(), value);
                      }}
                      selectedValueFromMin={
                        values["frommin" + (index + 1).toString()]
                      }
                      onSelectFromMin={(value) => {
                        setFieldValue(
                          "frommin" + (index + 1).toString(),
                          value
                        );
                      }}
                      selectedValueToHr={
                        values["tohr" + (index + 1).toString()]
                      }
                      onSelectToHr={(value) => {
                        setFieldValue("tohr" + (index + 1).toString(), value);
                      }}
                      selectedValueToMin={
                        values["tomin" + (index + 1).toString()]
                      }
                      onSelectToMin={(value) => {
                        setFieldValue("tomin" + (index + 1).toString(), value);
                      }}
                      onChangeDesc={(value) => {
                        setFieldValue("desc" + (index + 1).toString(), value);
                      }}
                    />
                  ))}

                  <AppButton
                    buttonName="Add New Delay"
                    buttonColour="#87A922"
                    width="60%"
                    onPress={handleAddDelayComponent}
                  />
                </View>
              </FieldSet>
              <AppButton
                buttonName="Submit"
                buttonColour="#fc5c65"
                onPress={handleSubmit}
              />
            </ScrollView>
          </>
        )}
      </Formik>
    </View>
  );
}
