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
//console.log

export default function EnterReclaiming({ navigation }) {
  const [coalNames, setCoalNames] = useState({});
  const [coalNameListCpp3, setCoalNameListCpp3] = useState();
  const [selectedCoalNameCpp3, setSelectedCoalNameCpp3] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);
  const [count, setCount] = useState(0);
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extraCoal, setExtraCoal] = useState([""]);
  const [cpp3Coal, setCpp3Coal] = useState([""]);
  const [exCount, setExCount] = useState(0);
  const [cpp3Count, setCpp3Count] = useState(0);
  const [ecCount, setEcCount] = useState(0);
  const [cpp3CCount, setCpp3CCount] = useState(0);
  const [totalReclaiming, setTotalReclaiming] = useState(0);
  const [totalValues, setTotalValues] = useState(Array(count).fill(""));
  const [nbTotalReclaiming, setNbTotalReclaiming] = useState(0);
  const [nbTotalValues, setNbTotalValues] = useState(Array(count).fill(""));
  const [cpp3TotalReclaiming, setCpp3TotalReclaiming] = useState(0);
  const [cpp3TotalValues, setCpp3TotalValues] = useState(Array(count).fill(""));

  const { setReclaimingData, globalDate, globalShift } =
    useContext(GlobalContext);
  const [reclaimingA, setReclaimingA] = useState();
  const [reclaimingB, setReclaimingB] = useState();
  const [isBlendChanged, setIsBlendChanged] = useState(false);

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift;

  useEffect(() => {
    const getCoalNames = async () => {
      try {
        const response = await axios.get(BaseUrl + "/blend", {
          params: {
            date: currentDate,
            shift: currentShift,
          },
        });
        const data = response.data.data[0];
        setCoalNames(data);
        setCount(data.total);

        let fdate = new Date(data.date).toISOString().split("T")[0];

        if (fdate === currentDate && data.shift === currentShift) {
          setIsBlendChanged(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCoalNames();
  }, []);

  useEffect(() => {
    const getAShiftRecl = async () => {
      if (currentShift === "B") {
        try {
          const response = await axios.get(BaseUrl + "/reclaiming", {
            params: {
              date: currentDate,
              shift: "A",
            },
          });

          setReclaimingA(response.data.data[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const getBShiftRecl = async () => {
      if (currentShift === "C") {
        try {
          const response = await axios.get(BaseUrl + "/reclaiming", {
            params: {
              date: currentDate,
              shift: "B",
            },
          });

          setReclaimingB(response.data.data[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getAShiftRecl();
    getBShiftRecl();
  }, []);

  useEffect(() => {
    if (reclaimingA !== undefined && currentShift === "B") {
      for (let i = 1; i <= 8; i++) {
        if (reclaimingA["excoal" + i + "name"] !== "") setExCount(i);
      }
    }
    if (reclaimingB !== undefined && currentShift === "C") {
      for (let i = 1; i <= 8; i++) {
        if (reclaimingB["excoal" + i + "name"] !== "") setExCount(i);
      }
    }
  }, [reclaimingA, reclaimingB]);

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
    setExtraCoal([...extraCoal, ""]);
    setEcCount(ecCount + 1);
  };
  const handleDelCoal = (index) => {
    const updatedExtraCoal = extraCoal.filter((_, i) => i != index);
    setExtraCoal(updatedExtraCoal);
    setEcCount(ecCount - 1);
    let delfromtot = nbTotalValues[index];
    if (delfromtot !== undefined)
      setNbTotalReclaiming(nbTotalReclaiming - delfromtot);
    setNbTotalValues((prevItems) => prevItems.slice(0, -1));
  };

  const handleCpp3AddCoal = () => {
    setCpp3Coal([...cpp3Coal, ""]);
    setCpp3CCount(cpp3CCount + 1);
  };
  const handleCpp3DelCoal = (index) => {
    const updatedCpp3Coal = cpp3Coal.filter((_, i) => i != index);
    setCpp3Coal(updatedCpp3Coal);
    setCpp3CCount(cpp3CCount - 1);
    let delfromtot = cpp3TotalValues[index];
    if (delfromtot !== undefined)
      setCpp3TotalReclaiming(cpp3TotalReclaiming - delfromtot);
    setCpp3TotalValues((prevItems) => prevItems.slice(0, -1));
  };

  const handleSubmit = (values) => {
    const reclaimRegex = /^[0-9]*$/;
    let coaltotal = 0;

    for (let i = 1; i <= 8; i++) {
      if (values["coal" + i + "recl"] === "") {
        values["coal" + i + "recl"] = 0;
      }
      if (values["excoal" + i + "recl"] === "") {
        values["excoal" + i + "recl"] = 0;
      }
      if (values["excoal" + i + "name"] === null) {
        return alert("Please enter only alphabets for coal name...");
      }
      if (values["cpp3coal" + i + "recl"] === "") {
        values["cpp3coal" + i + "recl"] = 0;
      }

      coaltotal =
        coaltotal +
        parseInt(values["coal" + i + "recl"]) +
        parseInt(values["excoal" + i + "recl"]);
    }

    let cc49 = values.cc49recl;
    let cc50 = values.cc50recl;
    let cc126 = values.cc126recl;

    let patha = values.patharecl;
    let pathb = values.pathbrecl;

    if (
      !reclaimRegex.test(cc49) ||
      !reclaimRegex.test(cc50) ||
      !reclaimRegex.test(cc126) ||
      !reclaimRegex.test(patha) ||
      !reclaimRegex.test(pathb)
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
    if (patha === "") {
      values["patharecl"] = 0;
    }
    if (pathb === "") {
      values["pathbrecl"] = 0;
    }
    let pathABtotal = parseInt(values.patharecl) + parseInt(values.pathbrecl);
    if (cpp3TotalReclaiming !== pathABtotal) {
      return alert("Cpp3 total should be equal to PathA & PathB Total..");
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
        values["excoal" + i + "recl"] = "";
        values["cpp3coal" + i + "recl"] = "";
      }
      values["cc49recl"] = "";
      values["cc50recl"] = "";
      values["cc126recl"] = "";
      values["patharecl"] = "";
      values["pathbrecl"] = "";

      return alert("Enter Reclaiming Data before submitting...");
    }
    if (currentShift === "B" && !isBlendChanged) {
      for (let i = 1; i <= 8; i++) {
        if (reclaimingA["excoal" + i + "name"] !== "")
          coalNames["excn" + i] = reclaimingA["excoal" + i + "name"];
      }
    }
    if (currentShift === "C" && !isBlendChanged) {
      for (let i = 1; i <= 8; i++) {
        if (reclaimingB["excoal" + i + "name"] !== "")
          coalNames["excn" + i] = reclaimingB["excoal" + i + "name"];
      }
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
      excoal1name: coalNames.excn1 ? coalNames.excn1 : values.excoal1name,
      excoal2name: coalNames.excn2 ? coalNames.excn2 : values.excoal2name,
      excoal3name: coalNames.excn3 ? coalNames.excn3 : values.excoal3name,
      excoal4name: coalNames.excn4 ? coalNames.excn4 : values.excoal4name,
      excoal5name: coalNames.excn5 ? coalNames.excn5 : values.excoal5name,
      excoal6name: coalNames.excn6 ? coalNames.excn6 : values.excoal6name,
      excoal7name: coalNames.excn7 ? coalNames.excn7 : values.excoal7name,
      excoal8name: coalNames.excn8 ? coalNames.excn8 : values.excoal8name,
      /*cpp3coal1name: values.cpp3coal1name,
      cpp3coal2name: values.cpp3coal2name,
      cpp3coal3name: values.cpp3coal3name,
      cpp3coal4name: values.cpp3coal4name,
      cpp3coal5name: values.cpp3coal5name,
      cc49recl: values.cc49recl,
      cc50recl: values.cc50recl,
      cc126recl: values.cc126recl,
      patharecl: values.patharecl,
      pathbrecl: values.pathbrecl,*/

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

      total_reclaiming: streamtotal,
      cpp3total_reclaiming: pathABtotal,
    };

    setProgress(0);
    setDoneScreen(true);
    setReclaimingData(newValues);
    setProgress(1);

    for (let i = 1; i <= count; i++) {
      values["coal" + i + "recl"] = "";
    }
    values["cc49recl"] = "";
    values["cc50recl"] = "";
    values["cc126recl"] = "";
    values["patharecl"] = "";
    values["pathbrecl"] = "";
    setTimeout(() => navigation.goBack(), 1000);
  };

  return (
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
        excoal1name: "",
        excoal2name: "",
        excoal3name: "",
        excoal4name: "",
        excoal5name: "",
        excoal6name: "",
        excoal7name: "",
        excoal8name: "",
        cpp3coal1name: "",
        cpp3coal2name: "",
        cpp3coal3name: "",
        cpp3coal4name: "",
        cpp3coal5name: "",
        cpp3coal6name: "",
        excoal1recl: "",
        excoal2recl: "",
        excoal3recl: "",
        excoal4recl: "",
        excoal5recl: "",
        excoal6recl: "",
        excoal7recl: "",
        excoal8recl: "",
        cpp3coal1recl: "",
        cpp3coal2recl: "",
        cpp3coal3recl: "",
        cpp3coal4recl: "",
        cpp3coal5recl: "",
        cpp3coal6recl: "",
        cc49recl: "",
        cc50recl: "",
        cc126recl: "",
        patharecl: "",
        pathbrecl: "",
        total_reclaiming: 0,
        cpp3total_reclaiming: 0,
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
          <View style={{ flex: 1 }}>
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
                  gap: wp(15),
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
                  Enter Reclaiming
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
            {isBlendChanged === true ? (
              <ScrollView
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: hp(20),
                  padding: hp(2),
                }}
              >
                <FieldSet label="Blended coal reclaiming">
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
                      Blended Coal Reclaiming
                    </Text>
                    {Array.from({ length: count }, (_, index) => {
                      return (
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
                                "coal" + (index + 1) + "recl",
                                value
                              );
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
                          value={values[
                            "coal" + (index + 1) + "recl"
                          ].toString()}
                          maxLength={4}
                        />
                      );
                    })}
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
                      Non-Blend Coal Reclaiming
                    </Text>
                    <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                      {extraCoal.map((value, index) => {
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
                                  alert("Coal Name must be alphabets...");
                                  return;
                                } else {
                                  setCoalNames({
                                    ...coalNames,
                                    [`excn${index + 1}`]: value,
                                  });
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
                                    "excoal" + (index + 1) + "recl",
                                    value
                                  );
                                  const nbCoalTotal = [...nbTotalValues];
                                  nbCoalTotal[index] = value;
                                  setNbTotalValues(nbCoalTotal);
                                  const total = nbCoalTotal.reduce(
                                    (sum, val) => sum + (parseInt(val) || 0),
                                    0
                                  );
                                  setNbTotalReclaiming(total);
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
                          buttonColour={ecCount + 1 !== 0 ? "brown" : "grey"}
                          width="30%"
                          onPress={() => handleDelCoal(ecCount)}
                          disabled={ecCount + 1 !== 0 ? false : true}
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
                      CPP-3 Coal Reclaiming
                    </Text>
                    <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                      {cpp3Count !== undefined &&
                        cpp3Coal.map((value, index) => {
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
                                    alert("Coal Name must be alphabets...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "cpp3coal" +
                                        (cpp3Count + (index + 1)) +
                                        "name",
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
                                placeholder="Tons"
                                onChangeText={(value) => {
                                  if (!/^[0-9]*$/.test(value)) {
                                    alert("Enter Numbers only...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "cpp3coal" +
                                        (cpp3Count + (index + 1)) +
                                        "recl",
                                      value
                                    );
                                    const cpp3CoalTotal = [...cpp3TotalValues];
                                    cpp3CoalTotal[index] = value;
                                    setCpp3TotalValues(cpp3CoalTotal);
                                    const total = cpp3CoalTotal.reduce(
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
                          onPress={handleCpp3AddCoal}
                        />
                        <AppButton
                          buttonName="Del Coal"
                          buttonColour={cpp3CCount + 1 !== 0 ? "brown" : "grey"}
                          width="30%"
                          onPress={() => handleCpp3DelCoal(cpp3CCount)}
                          disabled={cpp3CCount + 1 !== 0 ? false : true}
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
                          marginBottom: 10,
                        }}
                      >
                        Total Reclaiming :
                      </Text>
                      <Text
                        style={{
                          alignSelf: "left",

                          fontSize: hp(2.7),
                          fontWeight: "bold",
                          color: "black",
                          marginBottom: wp(3),
                          marginLeft: wp(10),
                        }}
                      >
                        {totalReclaiming +
                          nbTotalReclaiming +
                          cpp3TotalReclaiming}
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
                      Enter Stream-wise
                    </Text>

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
                    <AppTextBox
                      label={"Path-A(CPP3)"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("patharecl", value);
                        }
                      }}
                      value={values["patharecl"].toString()}
                      maxLength={4}
                    />
                    <AppTextBox
                      label={"Path-B(CPP3)"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("pathbrecl", value);
                        }
                      }}
                      value={values["pathbrecl"].toString()}
                      maxLength={4}
                    />
                  </>
                </FieldSet>
                <AppFormButton buttonText="Submit" />
              </ScrollView>
            ) : (
              <ScrollView
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: hp(20),
                  padding: hp(2),
                }}
              >
                <FieldSet label="Blended coal reclaiming">
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
                      Blended Coal Reclaiming
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
                        value={values["coal" + (index + 1) + "recl"].toString()}
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
                      Non-Blend Coal Reclaiming
                    </Text>
                    <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                      {/* {currentShift === "B" &&
                      reclaimingA !== undefined &&
                      reclaimingA.excoal1name !== ""
                        ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                            const coalName =
                              reclaimingA["excoal" + item + "name"];
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
                                        "excoal" + item + "recl",
                                        value
                                      );
                                      const newValues = [...totalValues];
                                      newValues[index] = value;
                                      setTotalValues(newValues);

                                      const total = newValues.reduce(
                                        (sum, val) =>
                                          sum + (parseInt(val) || 0),
                                        0
                                      );
                                      setTotalReclaiming(total);
                                    }
                                  }}
                                  keyboardType="number-pad"
                                  value={values[
                                    "excoal" + item + "recl"
                                  ].toString()}
                                  maxLength={4}
                                />
                              );
                            }
                            return null;
                          })
                        : null}

                      {currentShift === "C" &&
                      reclaimingB !== undefined &&
                      reclaimingB.excoal1name !== ""
                        ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                            const coalName =
                              reclaimingB["excoal" + item + "name"];

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
                                        "excoal" + item + "recl",
                                        value
                                      );
                                      const newValues = [...totalValues];
                                      newValues[index] = value;
                                      setTotalValues(newValues);

                                      const total = newValues.reduce(
                                        (sum, val) =>
                                          sum + (parseInt(val) || 0),
                                        0
                                      );
                                      setTotalReclaiming(total);
                                    }
                                  }}
                                  keyboardType="number-pad"
                                  value={values[
                                    "excoal" + item + "recl"
                                  ].toString()}
                                  maxLength={4}
                                />
                              );
                            }
                            return null;
                          })
                        : null}*/}

                      {exCount !== undefined &&
                        extraCoal.map((value, index) => {
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
                                    alert("Coal Name must be alphabets...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "excoal" + (index + 1) + "name",
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
                                placeholder="Tons"
                                onChangeText={(value) => {
                                  if (!/^[0-9]*$/.test(value)) {
                                    alert("Enter Numbers only...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "excoal" + (index + 1) + "recl",
                                      value
                                    );
                                    const nbCoalTotal = [...nbTotalValues];
                                    nbCoalTotal[index] = value;
                                    setNbTotalValues(nbCoalTotal);
                                    const total = nbCoalTotal.reduce(
                                      (sum, val) => sum + (parseInt(val) || 0),
                                      0
                                    );
                                    setNbTotalReclaiming(total);
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
                          buttonColour={ecCount + 1 !== 0 ? "brown" : "grey"}
                          width="30%"
                          onPress={() => handleDelCoal(ecCount)}
                          disabled={ecCount + 1 !== 0 ? false : true}
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
                          marginBottom: 10,
                        }}
                      >
                        Total Reclaiming :
                      </Text>
                      <Text
                        style={{
                          alignSelf: "left",

                          fontSize: hp(2.7),
                          fontWeight: "bold",
                          color: "black",
                          marginBottom: wp(3),
                          marginLeft: wp(10),
                        }}
                      >
                        {totalReclaiming + nbTotalReclaiming}
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
                      CPP-3 Coal Reclaiming
                    </Text>
                    <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
                      {cpp3Count !== undefined &&
                        cpp3Coal.map((value, index) => {
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
                              {/*  <TextInput
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
                                    alert("Coal Name must be alphabets...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "cpp3coal" +
                                        (cpp3Count + (index + 1)) +
                                        "name",
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
                                placeholder="Tons"
                                onChangeText={(value) => {
                                  if (!/^[0-9]*$/.test(value)) {
                                    alert("Enter Numbers only...");
                                    return;
                                  } else {
                                    setFieldValue(
                                      "cpp3coal" +
                                        (cpp3Count + (index + 1)) +
                                        "recl",
                                      value
                                    );
                                    const cpp3CoalTotal = [...cpp3TotalValues];
                                    cpp3CoalTotal[index] = value;
                                    setCpp3TotalValues(cpp3CoalTotal);
                                    const total = cpp3CoalTotal.reduce(
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
                          onPress={handleCpp3AddCoal}
                        />
                        <AppButton
                          buttonName="Del Coal"
                          buttonColour={cpp3CCount + 1 !== 0 ? "brown" : "grey"}
                          width="30%"
                          onPress={() => handleCpp3DelCoal(cpp3CCount)}
                          disabled={cpp3CCount + 1 !== 0 ? false : true}
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
                          marginBottom: 10,
                        }}
                      >
                        Total Reclaiming CPP3:
                      </Text>
                      <Text
                        style={{
                          alignSelf: "left",

                          fontSize: hp(2.7),
                          fontWeight: "bold",
                          color: "black",
                          marginBottom: wp(3),
                          marginLeft: wp(10),
                        }}
                      >
                        {cpp3TotalReclaiming}
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
                      Enter Stream-wise
                    </Text>

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
                    <AppTextBox
                      label={"Path-A(CPP3)"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("patharecl", value);
                        }
                      }}
                      value={values["patharecl"].toString()}
                      maxLength={4}
                    />
                    <AppTextBox
                      label={"Path-B(CPP3)"}
                      labelcolor={"#e9c46a"}
                      onChangeText={(value) => {
                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          return;
                        } else {
                          setFieldValue("pathbrecl", value);
                        }
                      }}
                      value={values["pathbrecl"].toString()}
                      maxLength={4}
                    />
                  </>
                </FieldSet>
                <AppFormButton buttonText="Submit" />
              </ScrollView>
            )}
          </View>
        </>
      )}
    </Formik>
  );
}
