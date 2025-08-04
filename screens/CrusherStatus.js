import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AppTextBox from "../components/AppTextBox";
import { AntDesign } from "@expo/vector-icons";
import AppFormButton from "../components/AppFormButton";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../components/ErrorMessage";
import FieldSet from "react-native-fieldset";
import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";
import { Picker } from "@react-native-picker/picker";
import CrusherComponent from "../components/CrusherComponent";
import { Button } from "@rneui/base";
import AppButton from "../components/AppButton";
import axios from "axios";

export default function CrusherStatus({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const {
    globalDate,
    globalShift,
    feedingData,
    allCrushersData,
    setAllCrushersData,
  } = useContext(GlobalContext);

  const [cr34Data, setCr34Data] = useState({});
  const [cr35Data, setCr35Data] = useState({});
  const [cr36Data, setCr36Data] = useState({});
  const [cr37Data, setCr37Data] = useState({});
  const [cr38Data, setCr38Data] = useState({});
  const [prevShiftCrusherData, setPrevShiftCrusherData] = useState();
  const [crushedCoal, setCrushedCoal] = useState();

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

  useEffect(() => {
    // console.log(feedingData);
    if (currentShift === "A") {
      let fdate = new Date(currentDate);
      fdate.setDate(fdate.getDate() - 1);
      let previousDate = fdate.toISOString().split("T")[0];
      getPrevShiftCrusherData(previousDate, "C");
    } else if (currentShift === "B") {
      let fdate = new Date(currentDate).toISOString().split("T")[0];
      getPrevShiftCrusherData(fdate, "A");
    } else {
      fdate = new Date(currentDate).toISOString().split("T")[0];
      getPrevShiftCrusherData(fdate, "B");
    }
  }, []);

  useEffect(() => {
    if (prevShiftCrusherData) {
      loadPrevShiftCrushData();
    }
  }, [prevShiftCrusherData]);

  useEffect(() => {
    if (!feedingData) {
      Alert.alert("Alert", "Enter Feeding First..", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ShiftReportEntry"),
          style: "cancel",
        },
      ]);
    }
  }, []);

  const getPrevShiftCrusherData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/crusher", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setPrevShiftCrusherData(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const loadPrevShiftCrushData = () => {
    setCr34Data({
      ...cr34Data,
      ["status"]: prevShiftCrusherData.cr34status,
      ["feeder"]: prevShiftCrusherData.cr34feeder,
    });
    setCr35Data({
      ...cr35Data,
      ["status"]: prevShiftCrusherData.cr35status,
      ["feeder"]: prevShiftCrusherData.cr35feeder,
    });
    setCr36Data({
      ...cr36Data,
      ["status"]: prevShiftCrusherData.cr36status,
      ["feeder"]: prevShiftCrusherData.cr36feeder,
    });
    setCr37Data({
      ...cr37Data,
      ["status"]: prevShiftCrusherData.cr37status,
      ["feeder"]: prevShiftCrusherData.cr37feeder,
    });
    setCr38Data({
      ...cr38Data,
      ["status"]: prevShiftCrusherData.cr38status,
      ["feeder"]: prevShiftCrusherData.cr38feeder,
    });
  };

  const handleSaveCr = async () => {
    if (
      cr34Data.status === undefined ||
      cr34Data.feeder === undefined ||
      cr34Data.status === "" ||
      cr34Data.feeder === "" ||
      cr35Data.status === undefined ||
      cr35Data.feeder === undefined ||
      cr35Data.status === "" ||
      cr35Data.feeder === "" ||
      cr36Data.status === undefined ||
      cr36Data.feeder === undefined ||
      cr36Data.status === "" ||
      cr36Data.feeder === "" ||
      cr37Data.status === undefined ||
      cr37Data.feeder === undefined ||
      cr37Data.status === "" ||
      cr37Data.feeder === "" ||
      cr38Data.status === undefined ||
      cr38Data.feeder === undefined ||
      cr38Data.status === "" ||
      cr38Data.feeder === ""
    ) {
      alert("Enter all values..");
      return;
    }

    /* let cr34f1coal = "";
    let cr34f2coal = "";
    let cr35f1coal = "";
    let cr35f2coal = "";
    let cr36f1coal = "";
    let cr36f2coal = "";
    let cr37f1coal = "";
    let cr37f2coal = "";
    let cr38f1coal = "";
    let cr38f2coal = "";
    if (cr34Data.status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (cr35Data.feeder === 1) cr34f1coal = crsdcoal;
      else cr34f2coal = crsdcoal;
    }
    if (cr35Data.status === "InUse") {
      let crcoal = feedingData.stream1 / 2;

      cr35f1coal = crcoal;
      cr35f2coal = crcoal;
    }
    if (cr36Data.status === "InUse") {
      let crcoal = feedingData.stream1 / 2;

      cr36f1coal = crcoal;
      cr36f2coal = crcoal;
    }
    if (cr37Data.status === "InUse") {
      let crcoal = feedingData.stream1A / 2;

      cr37f1coal = crcoal;
      cr37f2coal = crcoal;
    }
    if (cr38Data.status === "InUse") {
      let crcoal = feedingData.stream1A / 2;

      cr38f1coal = crcoal;
      cr38f2coal = crcoal;
    }*/

    let cr34f1coal = 0;
    let cr34f2coal = 0;
    let cr35f1coal = 0;
    let cr35f2coal = 0;
    let cr36f1coal = 0;
    let cr36f2coal = 0;
    let cr37f1coal = 0;
    let cr37f2coal = 0;
    let cr38f1coal = 0;
    let cr38f2coal = 0;

    if (cr34Data.status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (cr34Data.feeder === "1") {
        cr34f1coal = crsdcoal;
        cr34f2coal = 0;
      } else {
        cr34f2coal = crsdcoal;
        cr34f1coal = 0;
      }
    }

    if (cr35Data.status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (cr35Data.feeder === "1") {
        cr35f1coal = crsdcoal;
        cr35f2coal = 0;
      } else {
        cr35f2coal = crsdcoal;
        cr35f1coal = 0;
      }
    }
    if (cr36Data.status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (cr36Data.feeder === "1") {
        cr36f1coal = crsdcoal;
        cr36f2coal = 0;
      } else {
        cr36f2coal = crsdcoal;
        cr36f1coal = 0;
      }
    }

    if (cr37Data.status === "InUse" && cr38Data.status === "InUse") {
      let crsdcoal = feedingData.stream1A / 2;
      if (cr37Data.feeder === "1") {
        cr37f1coal = crsdcoal;
        cr37f2coal = 0;
      } else {
        cr37f2coal = crsdcoal;
        cr37f1coal = 0;
      }
      if (cr38Data.feeder === "1") {
        cr38f1coal = crsdcoal;
        cr38f2coal = 0;
      } else {
        cr38f2coal = crsdcoal;
        cr38f1coal = 0;
      }
    }

    if (cr37Data.status === "InUse" && cr38Data.status !== "InUse") {
      let crsdcoal = feedingData.stream1A;
      if (cr37Data.feeder === "1") {
        cr37f1coal = crsdcoal;
        cr37f2coal = 0;
      } else {
        cr37f2coal = crsdcoal;
        cr37f1coal = 0;
      }
      cr38f1coal = 0;
      cr38f2coal = 0;
    }

    if (cr37Data.status !== "InUse" && cr38Data.status === "InUse") {
      let crsdcoal = feedingData.stream1A;
      cr37f1coal = 0;
      cr37f2coal = 0;
      if (cr38Data.feeder === "1") {
        cr38f1coal = crsdcoal;
        cr38f2coal = 0;
      } else {
        cr38f2coal = crsdcoal;
        cr38f1coal = 0;
      }
    }

    if (cr37Data.status !== "InUse" && cr38Data.status !== "InUse") {
      cr37f1coal = 0;
      cr37f2coal = 0;
      cr38f1coal = 0;
      cr38f2coal = 0;
    }

    const crData = {
      date: currentDate,
      shift: currentShift,
      cr34status: cr34Data.status,
      cr34feeder: cr34Data.feeder,
      cr34feeder1coal: cr34f1coal,
      cr34feeder2coal: cr34f2coal,
      cr35status: cr35Data.status,
      cr35feeder: cr35Data.feeder,
      cr35feeder1coal: cr35f1coal,
      cr35feeder2coal: cr35f2coal,
      cr36status: cr36Data.status,
      cr36feeder: cr36Data.feeder,
      cr36feeder1coal: cr36f1coal,
      cr36feeder2coal: cr36f2coal,
      cr37status: cr37Data.status,
      cr37feeder: cr37Data.feeder,
      cr37feeder1coal: cr37f1coal,
      cr37feeder2coal: cr37f2coal,
      cr38status: cr38Data.status,
      cr38feeder: cr38Data.feeder,
      cr38feeder1coal: cr38f1coal,
      cr38feeder2coal: cr38f2coal,
    };
    const updatedData = {
      ...allCrushersData,
      ...crData,
    };
    await setAllCrushersData(updatedData);

    console.log(updatedData);

    setCr34Data({});
    setCr35Data({});
    setCr36Data({});
    setCr37Data({});
    setCr38Data({});

    navigation.goBack();
  };

  return (
    <Formik
      initialValues={{
        date: currentDate,
        shift: currentShift,
      }}
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
                gap: wp(14),
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
                Crushers Status
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
                DATE :{FormatDate(globalDate)}
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
          {!feedingData ? null : (
            <View
              style={{
                flexWrap: "wrap",

                marginTop: hp(25),
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ScrollView
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: hp(2),
                  flexDirection: "column",
                }}
              >
                <View style={{ flex: 1, gap: wp(5) }}>
                  <CrusherComponent
                    number={34}
                    colour="#FFD586"
                    onChangeStatus={(value) =>
                      setCr34Data({ ...cr34Data, ["status"]: value })
                    }
                    selectedStatus={
                      cr34Data.status
                        ? cr34Data.status
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr34status
                        : ""
                    }
                    onChangeFeeder={(value) =>
                      setCr34Data({ ...cr34Data, ["feeder"]: value })
                    }
                    selectedFeeder={
                      cr34Data.feeder
                        ? cr34Data.feeder
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr34feeder
                        : ""
                    }
                  />
                </View>

                <View style={{ flex: 1, gap: wp(5) }}>
                  <CrusherComponent
                    number={35}
                    colour="#FF9898"
                    onChangeStatus={(value) =>
                      setCr35Data({ ...cr35Data, ["status"]: value })
                    }
                    selectedStatus={
                      cr35Data.status
                        ? cr35Data.status
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr35status
                        : ""
                    }
                    onChangeFeeder={(value) =>
                      setCr35Data({ ...cr35Data, ["feeder"]: value })
                    }
                    selectedFeeder={
                      cr35Data.feeder
                        ? cr35Data.feeder
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr35feeder
                        : ""
                    }
                  />
                </View>

                <View style={{ flex: 1, gap: wp(5) }}>
                  <CrusherComponent
                    number={36}
                    colour="#7965C1"
                    onChangeStatus={(value) =>
                      setCr36Data({ ...cr36Data, ["status"]: value })
                    }
                    selectedStatus={
                      cr36Data.status
                        ? cr36Data.status
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr36status
                        : ""
                    }
                    onChangeFeeder={(value) =>
                      setCr36Data({ ...cr36Data, ["feeder"]: value })
                    }
                    selectedFeeder={
                      cr36Data.feeder
                        ? cr36Data.feeder
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr36feeder
                        : ""
                    }
                  />
                </View>

                <View style={{ flex: 1, gap: wp(5) }}>
                  <CrusherComponent
                    number={37}
                    colour="#129990"
                    onChangeStatus={(value) =>
                      setCr37Data({ ...cr37Data, ["status"]: value })
                    }
                    selectedStatus={
                      cr37Data.status
                        ? cr37Data.status
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr37status
                        : ""
                    }
                    onChangeFeeder={(value) =>
                      setCr37Data({ ...cr37Data, ["feeder"]: value })
                    }
                    selectedFeeder={
                      cr37Data.feeder
                        ? cr37Data.feeder
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr37feeder
                        : ""
                    }
                  />
                </View>

                <View style={{ flex: 1, gap: wp(5) }}>
                  <CrusherComponent
                    number={38}
                    colour="#DC8BE0"
                    onChangeStatus={(value) =>
                      setCr38Data({ ...cr38Data, ["status"]: value })
                    }
                    selectedStatus={
                      cr38Data.status
                        ? cr38Data.status
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr38status
                        : ""
                    }
                    onChangeFeeder={(value) =>
                      setCr38Data({ ...cr38Data, ["feeder"]: value })
                    }
                    selectedFeeder={
                      cr38Data.feeder
                        ? cr38Data.feeder
                        : prevShiftCrusherData
                        ? prevShiftCrusherData.cr38feeder
                        : ""
                    }
                  />
                </View>
                <AppButton buttonName="Save" onPress={handleSaveCr} />
              </ScrollView>
            </View>
          )}
        </>
      )}
    </Formik>
  );
}
