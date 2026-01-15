import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
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
console;
export default function BinStock({ navigation }) {
  const [coalNames, setCoalNames] = useState({});
  const [coalNameListCpp3, setCoalNameListCpp3] = useState();
  const [selectedCoalNameCpp3, setSelectedCoalNameCpp3] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [count, setCount] = useState();
  const [doneScreen, setDoneScreen] = useState(false);
  const [buttonEnable, setButtonEnable] = useState(false);
  const [progress, setProgress] = useState(0);
  const { mbTopStockData, setMbTopStockData, globalDate, globalShift } =
    useContext(GlobalContext);

  const [totalReclaiming, setTotalReclaiming] = useState(0);
  const [totalValues, setTotalValues] = useState(Array(count).fill(""));

  const [latestRecord, setLatestRecord] = useState();
  const [latestRecordLoaded, setLatestRecordLoaded] = useState(false);
  const [lastShiftRecl, setLastShiftRecl] = useState();
  const [excount, setExCount] = useState();

  const [oldCoal, setOldCoal] = useState([""]);
  const [oldCount, setOldCount] = useState(0);
  const [oldTotalReclaiming, setOldTotalReclaiming] = useState(0);
  const [oldTotalValues, setOldTotalValues] = useState(Array(count).fill(""));

  const [cpp3Coal, setCpp3Coal] = useState([""]);
  const [cpp3Count, setCpp3Count] = useState(0);
  const [cpp3TotalReclaiming, setCpp3TotalReclaiming] = useState(0);
  const [cpp3TotalValues, setCpp3TotalValues] = useState(Array(count).fill(""));

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

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

  useEffect(() => {
    const getLatestRecord = async () => {
      await axios
        .get(BaseUrl + "/shiftreportenteredbylatest")
        .then((response) => {
          setLatestRecord(response.data.data);
        })
        .catch((error) => {
          alert("latest record not found  " + error);
        });
    };
    getLatestRecord();
  }, []);

  useEffect(() => {
    const getLastShiftRecl = async () => {
      setLatestRecordLoaded(true);
      if (latestRecord) {
        let date = new Date(latestRecord.date);
        let shift = latestRecord.shift;
        date.setDate(date.getDate());
        try {
          const response = await axios.get(BaseUrl + "/reclaiming", {
            params: {
              date: date,
              shift: shift,
            },
          });
          setLastShiftRecl(response.data.data[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getLastShiftRecl();
  }, [latestRecord]);

  useEffect(() => {
    const getExCoalCount = () => {
      if (lastShiftRecl !== undefined) {
        for (let i = 1; i <= 8; i++) {
          if (lastShiftRecl["excoal" + i + "name"] !== "") setExCount(i);
        }
      }
    };
    getExCoalCount();
  }, [lastShiftRecl]);

  useEffect(() => {
    const getCoalNameListCpp3 = async () => {
      await axios
        .get(BaseUrl + "/coalnamelist")
        .then((response) => {
          //setCoalNameListCpp3(response.data.data[0]);
          //console.log(response.data.data[0]);
          let data = response.data.data[0];
          const coalNames = Object.keys(data)
            .filter((key) => key.startsWith("coalname")) // take only coalname keys
            .map((key) => data[key]) // extract values
            .filter((name) => name && name.trim() !== ""); // remove empty strings
          const coalNamesFinal = ["Coal", ...coalNames];
          setCoalNameListCpp3(coalNamesFinal);
        })
        .catch((error) => console.log(error));
      setIsLoaded(false);
    };
    getCoalNameListCpp3();
  }, []);

  const handleAddCoal = () => {
    setOldCoal([...oldCoal, ""]);
    setOldCount(oldCount + 1);
  };

  const handleDelCoal = (index) => {
    const updatedOldCoal = oldCoal.filter((_, i) => i != index);
    setOldCoal(updatedOldCoal);
    setOldCount(oldCount - 1);
    let delfromtot = oldTotalValues[index];
    if (delfromtot !== undefined)
      setOldTotalReclaiming(oldTotalReclaiming - delfromtot);
    setOldTotalValues((prevItems) => prevItems.slice(0, -1));
  };

  const handleAddCpp3Coal = () => {
    setCpp3Coal([...cpp3Coal, ""]);
    setCpp3Count(cpp3Count + 1);
  };

  const handleDelCpp3Coal = (index) => {
    const updatedCpp3Coal = cpp3Coal.filter((_, i) => i != index);
    setCpp3Coal(updatedCpp3Coal);
    setCpp3Count(cpp3Count - 1);
    let delfromtot = cpp3TotalValues[index];
    if (delfromtot !== undefined)
      setCpp3TotalReclaiming(cpp3TotalReclaiming - delfromtot);
    setCpp3TotalValues((prevItems) => prevItems.slice(0, -1));
  };

  const handleSubmit = async (values) => {
    if (
      values["coal1stock"] === 0 &&
      values["coal2stock"] === 0 &&
      values["coal3stock"] === 0 &&
      values["coal4stock"] === 0 &&
      values["coal5stock"] === 0 &&
      values["coal6stock"] === 0 &&
      values["coal7stock"] === 0 &&
      values["coal8stock"] === 0
    ) {
      return alert("Make sure to enter all stocks..");
    }

    let TotalStock = 0;
    let Cpp3TotalStock = 0;
    for (let i = 1; i <= 8; i++) {
      if (values["oldcoal" + i + "stock"] === "") {
        values["oldcoal" + i + "stock"] = 0;
      }
    }
    for (let i = 1; i <= 6; i++) {
      if (values["cpp3coal" + i + "stock"] === "") {
        values["cpp3coal" + i + "stock"] = 0;
      }
    }
    for (let i = 1; i <= count; i++) {
      if (values["coal" + i + "stock"] === "") {
        alert("Enter all fields..");
        return;
      } else
        TotalStock =
          TotalStock +
          parseInt(values["coal" + i + "stock"]) +
          parseInt(values["oldcoal" + i + "stock"]);
      Cpp3TotalStock =
        Cpp3TotalStock + parseInt(values["cpp3coal" + i + "stock"]);
    }
    let newValues = {
      ...values,
      coal1name: coalNames.cn1 ? coalNames.cn1 : "",
      coal2name: coalNames.cn2 ? coalNames.cn2 : "",
      coal3name: coalNames.cn3 ? coalNames.cn3 : "",
      coal4name: coalNames.cn4 ? coalNames.cn4 : "",
      coal5name: coalNames.cn5 ? coalNames.cn5 : "",
      coal6name: coalNames.cn6 ? coalNames.cn6 : "",
      coal7name: coalNames.cn7 ? coalNames.cn7 : "",
      coal8name: coalNames.cn8 ? coalNames.cn8 : "",
      cpp3coal1name: selectedCoalNameCpp3.cpp3coal1name
        ? selectedCoalNameCpp3.cpp3coal1name
        : "",
      cpp3coal2name: selectedCoalNameCpp3.cpp3coal2name
        ? selectedCoalNameCpp3.cpp3coal2name
        : "",
      cpp3coal3name: selectedCoalNameCpp3.cpp3coal3name
        ? selectedCoalNameCpp3.cpp3coal3name
        : "",
      cpp3coal4name: selectedCoalNameCpp3.cpp3coal4name
        ? selectedCoalNameCpp3.cpp3coal4name
        : "",
      cpp3coal5name: selectedCoalNameCpp3.cpp3coal5name
        ? selectedCoalNameCpp3.cpp3coal5name
        : "",
      cpp3coal6name: selectedCoalNameCpp3.cpp3coal6name
        ? selectedCoalNameCpp3.cpp3coal6name
        : "",

      total_stock: TotalStock,
      cpp3total_stock: Cpp3TotalStock,
    };

    setMbTopStockData(newValues);
    setProgress(0);

    setDoneScreen(true);
    setProgress(1);

    for (let i = 1; i <= count; i++) {
      values["coal" + i + "stock"] = "";
      values["oldcoal" + i + "stock"] = "";
      values["cpp3coal" + i + "stock"] = "";
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

        cpp3coal1name: "",
        cpp3coal1stock: 0,
        cpp3coal2name: "",
        cpp3coal2stock: 0,
        cpp3coal3name: "",
        cpp3coal3stock: 0,
        cpp3coal4name: "",
        cpp3coal4stock: 0,
        cpp3coal5name: "",
        cpp3coal5stock: 0,
        cpp3coal6name: "",
        cpp3coal6stock: 0,
        total_stock: 0,
        cpp3total_stock: 0,
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
                    Non-Blend Coal Stocks
                  </Text>
                  <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                    {/*} {latestRecord &&
                    lastShiftRecl &&
                    lastShiftRecl.excoal1name !== ""
                      ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                          const coalName =
                            lastShiftRecl["excoal" + item + "name"];
                          if (coalName !== "") {
                            return (
                              <AppTextBox
                                label={coalName}
                                labelcolor="orange"
                                key={index}
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
                                keyboardType="number-pad"
                                value={values[
                                  "oldcoal" + item + "stock"
                                ].toString()}
                                maxLength={4}
                              />
                            );
                          }
                          return null;
                        })
                      : null}*/}

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
                            autoCapitalize="characters"
                            onChangeText={(value) => {
                              if (/^[0-9]*$/.test(value)) {
                                return alert("Coal Name must be alphabets...");
                              } else {
                                setFieldValue(
                                  "oldcoal" + (index + 1) + "name",
                                  value.toUpperCase()
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
                        buttonColour={oldCount + 1 !== 0 ? "brown" : "grey"}
                        width="30%"
                        onPress={() => handleDelCoal(oldCount)}
                        disabled={oldCount + 1 !== 0 ? false : true}
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
                    {cpp3Coal.map((item, index) => {
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
                          {/*<TextInput
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
                            autoCapitalize="characters"
                            onChangeText={(value) => {
                              if (/^[0-9]*$/.test(value)) {
                                return alert("Coal Name must be alphabets...");
                              } else {
                                setFieldValue(
                                  "cpp3coal" + (index + 1) + "name",
                                  value.toUpperCase()
                                );
                              }
                            }}
                          />*/}
                          <Picker
                            id={index}
                            style={{
                              width: wp(35),
                              borderWidth: wp(1),
                              backgroundColor: "white",
                            }}
                            mode="dropdown"
                            onValueChange={(value) => {
                              setSelectedCoalNameCpp3({
                                ...selectedCoalNameCpp3,
                                ["cpp3coal" + (index + 1) + "name"]:
                                  value.toUpperCase(),
                              });
                            }}
                            selectedValue={
                              selectedCoalNameCpp3
                                ? selectedCoalNameCpp3[
                                    "cpp3coal" + (index + 1) + "name"
                                  ]
                                : "Coal"
                            }
                          >
                            {coalNameListCpp3
                              ? coalNameListCpp3.map((coal) => (
                                  <Picker.Item
                                    key={coal}
                                    label={coal.toString()}
                                    value={coal}
                                    style={{ fontSize: hp(2.5) }}
                                  />
                                ))
                              : null}
                          </Picker>
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
                                  "cpp3coal" + (index + 1) + "stock",
                                  value
                                );

                                const cpp3StockTot = [...cpp3TotalValues];
                                cpp3StockTot[index] = value;
                                setCpp3TotalValues(cpp3StockTot);
                                const total = cpp3StockTot.reduce(
                                  (sum, val) => sum + (parseInt(val) || 0),
                                  0
                                );
                                setCpp3TotalReclaiming(total);
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
                        onPress={handleAddCpp3Coal}
                      />
                      <AppButton
                        buttonName="Del Coal"
                        buttonColour={cpp3Count + 1 !== 0 ? "brown" : "grey"}
                        width="30%"
                        onPress={() => handleDelCpp3Coal(cpp3Count)}
                        disabled={cpp3Count + 1 !== 0 ? false : true}
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
                      CPP3 Total Stock :
                    </Text>
                    <Text
                      style={{
                        alignSelf: "left",
                        fontSize: hp(2.7),
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: wp(10),
                      }}
                    >
                      {cpp3TotalReclaiming}
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
