import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import AppTextBox from "../components/AppTextBox";
import AppButton from "../components/AppButton";
import axios from "axios";
import AppFormButton from "../components/AppFormButton";
import { AntDesign } from "@expo/vector-icons";

import BaseUrl from "../config/BaseUrl";
import FieldSet from "react-native-fieldset";
import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";

export default function BinStock({ navigation }) {
  const [coalNames, setCoalNames] = useState({});
  const [count, setCount] = useState();
  const [doneScreen, setDoneScreen] = useState(false);
  const [buttonEnable, setButtonEnable] = useState(false);
  const [progress, setProgress] = useState(0);
  const { mbTopStockData, setMbTopStockData, globalDate, globalShift } =
    useContext(GlobalContext);
  const [totalReclaiming, setTotalReclaiming] = useState(0);
  const [oldTotalReclaiming, setOldTotalReclaiming] = useState(0);
  const [totalValues, setTotalValues] = useState(Array(count).fill(""));
  const [oldTotalValues, setOldTotalValues] = useState(Array(count).fill(""));
  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());
  const [oldCount, setOldCount] = useState(0);
  const [oldCoal, setOldCoal] = useState([""]);

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
          setButtonEnable(true);
        })
        .catch((error) => console.log(error));
    };
    getCoalNames();
  }, []);

  const handleAddCoal = () => {
    setOldCoal([...oldCoal, ""]);
    setOldCount(oldCount + 1);
  };
  const handleDelCoal = (index) => {
    const updatedOldCoal = oldCoal.filter((_, i) => i != index);
    setOldCoal(updatedOldCoal);
    setOldCount(oldCount - 1);
  };

  const handleSubmit = async (values) => {
    let TotalStock = 0;

    for (let i = 1; i <= count; i++) {
      if (values["coal" + i + "stock"] === "") {
        alert("Enter all fields..");
        return;
      } else
        TotalStock =
          TotalStock +
          parseInt(values["coal" + i + "stock"]) +
          parseInt(values["oldcoal" + i + "stock"]);
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

    setMbTopStockData(newValues);
    setProgress(0);
    setDoneScreen(true);
    setProgress(1);

    for (let i = 1; i <= count; i++) {
      values["coal" + i + "stock"] = 0;
      values["oldcoal" + i + "stock"] = 0;
    }
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
    <Formik
      initialValues={{
        date: currentDate,
        shift: currentShift,
        coal1name: "",
        coal1stock: 0,
        coal2name: "",
        coal2stock: 0,
        coal3name: "",
        coal3stock: 0,
        coal4name: "",
        coal4stock: 0,
        coal5name: "",
        coal5stock: 0,
        coal6name: "",
        coal6stock: 0,
        coal7name: "",
        coal7stock: 0,
        coal8name: "",
        coal8stock: 0,

        oldcoal1name: "",
        oldcoal1stock: 0,
        oldcoal2name: "",
        oldcoal2stock: 0,
        oldcoal3name: "",
        oldcoal3stock: 0,
        oldcoal4name: "",
        oldcoal4stock: 0,
        oldcoal5name: "",
        oldcoal5stock: 0,
        oldcoal6name: "",
        oldcoal6stock: 0,
        oldcoal7name: "",
        oldcoal7stock: 0,
        oldcoal8name: "",
        oldcoal8stock: 0,
        total_stock: 0,
      }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
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
                  paddingTop: hp(2),
                  paddingLeft: hp(2),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp(8),
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
                  Enter MB-Top Stock
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
                    Enter Coal-Wise
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
                          setFieldValue("coal" + (index + 1) + "stock", value);

                          const newValues = [...totalValues];
                          newValues[index] = value;
                          setTotalValues(newValues);
                          const total = newValues.reduce(
                            (sum, val) => sum + (parseInt(val) || 0),
                            0
                          );
                          setTotalReclaiming(total);
                        }
                      }}
                      keyboardType="number-pad"
                      value={values["coal" + (index + 1) + "stock"]}
                      maxLength={4}
                    />
                  ))}
                </>
              </FieldSet>
              <FieldSet>
                <>
                  <Text
                    style={{
                      alignSelf: "center",
                      borderBottomWidth: 2,
                      fontSize: hp(2.7),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: 20,
                    }}
                  >
                    Non-Blend Coal Stocks (if any..)
                  </Text>
                  <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                    {oldCoal.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            borderRadius: 25,
                            width: wp(30),
                            height: hp(6),
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 20,
                            gap: wp(10),
                          }}
                        >
                          <TextInput
                            selectionColor={"black"}
                            style={{
                              height: hp(6),
                              width: wp(40),
                              paddingLeft: wp(2),
                              fontSize: hp(3),
                              fontFamily: "Roboto",
                              borderWidth: wp(0.3),
                              borderRadius: 10,
                              borderColor: "#0c0c0c",
                              backgroundColor: "white",
                            }}
                            placeholder="Coal Name"
                            onChangeText={(value) => {
                              if (/^[0-9]*$/.test(value)) {
                                return alert("Coal Name must be alphabets...");
                              } else {
                                setFieldValue(
                                  "oldcoal" + (index + 1) + "name",
                                  value
                                );
                              }
                            }}
                          />
                          <TextInput
                            selectionColor={"black"}
                            style={{
                              height: hp(6),
                              width: wp(30),
                              paddingLeft: wp(2),
                              fontSize: hp(3),
                              fontFamily: "Roboto",
                              borderWidth: wp(0.3),
                              borderRadius: 10,
                              borderColor: "#0c0c0c",
                              backgroundColor: "white",
                            }}
                            keyboardType="number-pad"
                            placeholder="Value"
                            onChangeText={(value) => {
                              if (!/^[0-9]*$/.test(value)) {
                                alert("Enter Numbers only...");
                                return;
                              } else {
                                setFieldValue(
                                  "oldcoal" + (index + 1) + "stock",
                                  value
                                );

                                const oldStockTot = [...oldTotalValues];
                                oldStockTot[index] = value;
                                setOldTotalValues(oldStockTot);
                                const total = oldStockTot.reduce(
                                  (sum, val) => sum + (parseInt(val) || 0),
                                  0
                                );
                                setOldTotalReclaiming(total);
                              }
                            }}
                          />
                        </View>
                      );
                    })}
                    <View
                      style={{
                        flexDirection: "row",
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        gap: wp(10),
                      }}
                    >
                      <AppButton
                        buttonName="Add Coal"
                        buttonColour={"#87A922"}
                        width="30%"
                        onPress={handleAddCoal}
                      />
                      <AppButton
                        buttonName="Del Coal"
                        buttonColour={"brown"}
                        width="30%"
                        onPress={() => handleDelCoal(oldCount)}
                      />
                    </View>
                  </View>
                </>
              </FieldSet>
              <FieldSet>
                <>
                  <Text
                    style={{
                      alignSelf: "center",
                      borderBottomWidth: 2,
                      fontSize: hp(2.7),
                      fontWeight: "bold",
                      color: "black",
                      marginBottom: 20,
                    }}
                  >
                    CPP-3 Coal Stocks
                  </Text>
                  <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                    {oldCoal.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            borderRadius: 25,
                            width: wp(30),
                            height: hp(6),
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 20,
                            gap: wp(10),
                          }}
                        >
                          <TextInput
                            selectionColor={"black"}
                            style={{
                              height: hp(6),
                              width: wp(40),
                              paddingLeft: wp(2),
                              fontSize: hp(3),
                              fontFamily: "Roboto",
                              borderWidth: wp(0.3),
                              borderRadius: 10,
                              borderColor: "#0c0c0c",
                              backgroundColor: "white",
                            }}
                            placeholder="Coal Name"
                            onChangeText={(value) => {
                              if (/^[0-9]*$/.test(value)) {
                                return alert("Coal Name must be alphabets...");
                              } else {
                                setFieldValue(
                                  "oldcoal" + (index + 1) + "name",
                                  value
                                );
                              }
                            }}
                          />
                          <TextInput
                            selectionColor={"black"}
                            style={{
                              height: hp(6),
                              width: wp(30),
                              paddingLeft: wp(2),
                              fontSize: hp(3),
                              fontFamily: "Roboto",
                              borderWidth: wp(0.3),
                              borderRadius: 10,
                              borderColor: "#0c0c0c",
                              backgroundColor: "white",
                            }}
                            keyboardType="number-pad"
                            placeholder="Value"
                            onChangeText={(value) => {
                              if (!/^[0-9]*$/.test(value)) {
                                alert("Enter Numbers only...");
                                return;
                              } else {
                                setFieldValue(
                                  "oldcoal" + (index + 1) + "stock",
                                  value
                                );

                                const oldStockTot = [...oldTotalValues];
                                oldStockTot[index] = value;
                                setOldTotalValues(oldStockTot);
                                const total = oldStockTot.reduce(
                                  (sum, val) => sum + (parseInt(val) || 0),
                                  0
                                );
                                setOldTotalReclaiming(total);
                              }
                            }}
                          />
                        </View>
                      );
                    })}
                    <View
                      style={{
                        flexDirection: "row",
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20,
                        gap: wp(10),
                      }}
                    >
                      <AppButton
                        buttonName="Add Coal"
                        buttonColour={"#87A922"}
                        width="30%"
                        onPress={handleAddCoal}
                      />
                      <AppButton
                        buttonName="Del Coal"
                        buttonColour={"brown"}
                        width="30%"
                        onPress={() => handleDelCoal(oldCount)}
                      />
                    </View>
                  </View>
                </>
              </FieldSet>
              <FieldSet>
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        alignSelf: "left",
                        fontSize: hp(2.7),
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: wp(10),
                      }}
                    >
                      Total Stock :
                    </Text>
                    <Text
                      style={{
                        alignSelf: "left",
                        fontSize: hp(2.7),
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: wp(20),
                      }}
                    >
                      {totalReclaiming + oldTotalReclaiming}
                    </Text>
                  </View>
                </>
              </FieldSet>
              <AppFormButton
                buttonText="Submit"
                disabled={!buttonEnable}
                buttonColour={buttonEnable ? "#fc5c65" : "#C7B7A3"}
              />
            </ScrollView>
          </View>
        </>
      )}
    </Formik>
  );
}
