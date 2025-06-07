import { View, Text, ScrollView } from "react-native";
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

export default function CrusherStatus({ navigation, route }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { globalDate, globalShift, allCrushersData, setAllCrushersData } =
    useContext(GlobalContext);

  const [cr34Visible, setCr34Visible] = useState(false);
  const [cr35Visible, setCr35Visible] = useState(false);
  const [cr36Visible, setCr36Visible] = useState(false);
  const [cr37Visible, setCr37Visible] = useState(false);
  const [cr38Visible, setCr38Visible] = useState(false);

  const [cr34Data, setCr34Data] = useState({});
  const [cr35Data, setCr35Data] = useState({});
  const [cr36Data, setCr36Data] = useState({});
  const [cr37Data, setCr37Data] = useState({});
  const [cr38Data, setCr38Data] = useState({});

  const [crd, setcrd] = useState([{}]);
  console;
  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const initAllCrushersData = () => {
      const allCrushersDatatemp = {
        date: currentDate,
        shift: currentShift,
      };
      setAllCrushersData(allCrushersDatatemp);
    };

    initAllCrushersData();
  }, []);
  useEffect(() => {
    setCr34Visible(!cr34Visible);
  }, []);

  const handleSaveCr34 = async () => {
    if (
      cr34Data.status === undefined ||
      cr34Data.feeder === undefined ||
      cr34Data.status === "" ||
      cr34Data.feeder === ""
    ) {
      alert("Enter all values..");
      return;
    }
    const cr34temp = {
      cr34status: cr34Data.status,
      cr34feeder: cr34Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...cr34temp,
    };
    await setAllCrushersData(updatedData);
    setCr34Data("");
    setCr35Visible(!cr35Visible);
    setCr34Visible(false),
      setCr36Visible(false),
      setCr37Visible(false),
      setCr38Visible(false);
  };

  const handleSaveCr35 = async () => {
    if (
      cr35Data.status === undefined ||
      cr35Data.feeder === undefined ||
      cr35Data.status === "" ||
      cr35Data.feeder === ""
    ) {
      alert("Enter all values..");
      return;
    }
    const cr35temp = {
      cr35status: cr35Data.status,
      cr35feeder: cr35Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...cr35temp,
    };
    await setAllCrushersData(updatedData);
    setCr35Data("");
    setCr36Visible(!cr36Visible);
    setCr34Visible(false),
      setCr35Visible(false),
      setCr37Visible(false),
      setCr38Visible(false);
  };

  const handleSaveCr36 = async () => {
    if (
      cr36Data.status === undefined ||
      cr36Data.feeder === undefined ||
      cr36Data.status === "" ||
      cr36Data.feeder === ""
    ) {
      alert("Enter all values..");
      return;
    }
    const cr36temp = {
      cr36status: cr36Data.status,
      cr36feeder: cr36Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...cr36temp,
    };
    await setAllCrushersData(updatedData);
    setCr36Data("");
    setCr37Visible(!cr37Visible);
    setCr34Visible(false),
      setCr35Visible(false),
      setCr36Visible(false),
      setCr38Visible(false);
  };

  const handleSaveCr37 = async () => {
    if (
      cr37Data.status === undefined ||
      cr37Data.feeder === undefined ||
      cr37Data.status === "" ||
      cr37Data.feeder === ""
    ) {
      alert("Enter all values..");
      return;
    }
    const cr37temp = {
      cr37status: cr37Data.status,
      cr37feeder: cr37Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...cr37temp,
    };
    await setAllCrushersData(updatedData);
    setCr37Data("");
    setCr38Visible(!cr38Visible);
    setCr34Visible(false),
      setCr35Visible(false),
      setCr36Visible(false),
      setCr37Visible(false);
  };

  const handleSaveCr38 = async () => {
    if (
      cr38Data.status === undefined ||
      cr38Data.feeder === undefined ||
      cr38Data.status === "" ||
      cr38Data.feeder === ""
    ) {
      5;
      alert("Enter all values..");
      return;
    }
    const cr38temp = {
      cr38status: cr38Data.status,
      cr38feeder: cr38Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...cr38temp,
    };
    await setAllCrushersData(updatedData);
    setCr38Data("");
    setCr38Visible(false);
    onPressBackButton();
  };
  const onPressBackButton = () => {
    if (
      cr34Data === "" &&
      cr35Data === "" &&
      cr36Data === "" &&
      cr37Data === ""
    ) {
      navigation.goBack();
    } else {
      alert("Enter all crushers data..");
      return;
    }
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
                onPress={onPressBackButton}
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
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              height: hp(10),
              width: wp(100),
              marginTop: hp(25),
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: wp(5),
            }}
          >
            <Button
              title={"34"}
              buttonStyle={{
                width: wp(15),
                height: hp(6),
                marginHorizontal: wp(1.25),
              }}
              radius={60}
              color="#FFD586"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => {
                setCr34Visible(!cr34Visible),
                  setCr35Visible(false),
                  setCr36Visible(false),
                  setCr37Visible(false),
                  setCr38Visible(false);
              }}
              disabled={cr34Data === "" ? true : false}
            ></Button>

            <Button
              title={"35"}
              buttonStyle={{
                width: wp(15),
                height: hp(6),
                marginHorizontal: wp(1.25),
              }}
              radius={60}
              color="#FF9898"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => {
                setCr35Visible(!cr35Visible),
                  setCr34Visible(false),
                  setCr36Visible(false),
                  setCr37Visible(false),
                  setCr38Visible(false);
              }}
              disabled={cr35Data === "" ? true : false}
            ></Button>

            <Button
              title={"36"}
              buttonStyle={{
                width: wp(15),
                height: hp(6),
                marginHorizontal: wp(1.25),
              }}
              radius={60}
              color="#7965C1"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => {
                setCr36Visible(!cr36Visible),
                  setCr35Visible(false),
                  setCr34Visible(false),
                  setCr37Visible(false),
                  setCr38Visible(false);
              }}
              disabled={cr36Data === "" ? true : false}
            ></Button>

            <Button
              title={"37"}
              buttonStyle={{
                width: wp(15),
                height: hp(6),
                marginHorizontal: wp(1.25),
              }}
              radius={60}
              color="#129990"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => {
                setCr37Visible(!cr37Visible),
                  setCr35Visible(false),
                  setCr36Visible(false),
                  setCr34Visible(false),
                  setCr38Visible(false);
              }}
              disabled={cr37Data === "" ? true : false}
            ></Button>
            <Button
              title={"38"}
              buttonStyle={{
                width: wp(15),
                height: hp(6),
                marginHorizontal: wp(1.25),
              }}
              radius={60}
              color="#DC8BE0"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => {
                setCr38Visible(!cr38Visible),
                  setCr35Visible(false),
                  setCr36Visible(false),
                  setCr37Visible(false),
                  setCr34Visible(false);
              }}
              disabled={cr38Data === "" ? true : false}
            ></Button>
          </View>

          <ScrollView
            style={{
              position: "relative",
              zIndex: 1,
              padding: hp(2),
            }}
          >
            {cr34Visible && (
              <View style={{ flex: 1, gap: wp(5) }}>
                <CrusherComponent
                  number={34}
                  colour="#FFD586"
                  onChangeStatus={(value) =>
                    setCr34Data({ ...cr34Data, ["status"]: value })
                  }
                  selectedStatus={cr34Data.status}
                  onChangeFeeder={(value) =>
                    setCr34Data({ ...cr34Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr34Data.feeder}
                  onChangeCurrent={(value) =>
                    setCr34Data({ ...cr34Data, ["current"]: value })
                  }
                  valueCurrent={cr34Data.current}
                  onChangeRpm={(value) =>
                    setCr34Data({ ...cr34Data, ["rpm"]: value })
                  }
                  valueRpm={cr34Data.rpm}
                  onChangeTcol={(value) =>
                    setCr34Data({ ...cr34Data, ["tcol"]: value })
                  }
                  selectedTcol={cr34Data.tcol}
                  onChangeTcop={(value) =>
                    setCr34Data({ ...cr34Data, ["tcop"]: value })
                  }
                  valueTcop={cr34Data.tcop}
                  onChangeTcot={(value) =>
                    setCr34Data({ ...cr34Data, ["tcot"]: value })
                  }
                  valueTcot={cr34Data.tcot}
                  onChangeGbol={(value) =>
                    setCr34Data({ ...cr34Data, ["gbol"]: value })
                  }
                  selectedGbol={cr34Data.gbol}
                  onChangeGbop={(value) =>
                    setCr34Data({ ...cr34Data, ["gbop"]: value })
                  }
                  valueGbop={cr34Data.gbop}
                  onChangeGbot={(value) =>
                    setCr34Data({ ...cr34Data, ["gbot"]: value })
                  }
                  valueGbot={cr34Data.gbot}
                />
                <AppButton
                  buttonName="Save"
                  onPress={handleSaveCr34}
                  disabled={!cr34Data}
                />
              </View>
            )}
            {cr35Visible && (
              <View style={{ flex: 1, gap: wp(5) }}>
                <CrusherComponent
                  number={35}
                  colour="#FF9898"
                  onChangeStatus={(value) =>
                    setCr35Data({ ...cr35Data, ["status"]: value })
                  }
                  selectedStatus={cr35Data.status}
                  onChangeFeeder={(value) =>
                    setCr35Data({ ...cr35Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr35Data.feeder}
                  onChangeCurrent={(value) =>
                    setCr35Data({ ...cr35Data, ["current"]: value })
                  }
                  valueCurrent={cr35Data.current}
                  onChangeRpm={(value) =>
                    setCr35Data({ ...cr35Data, ["rpm"]: value })
                  }
                  valueRpm={cr35Data.rpm}
                  onChangeTcol={(value) =>
                    setCr35Data({ ...cr35Data, ["tcol"]: value })
                  }
                  selectedTcol={cr35Data.tcol}
                  onChangeTcop={(value) =>
                    setCr35Data({ ...cr35Data, ["tcop"]: value })
                  }
                  valueTcop={cr35Data.tcop}
                  onChangeTcot={(value) =>
                    setCr35Data({ ...cr35Data, ["tcot"]: value })
                  }
                  valueTcot={cr35Data.tcot}
                  onChangeGbol={(value) =>
                    setCr35Data({ ...cr35Data, ["gbol"]: value })
                  }
                  selectedGbol={cr35Data.gbol}
                  onChangeGbop={(value) =>
                    setCr35Data({ ...cr35Data, ["gbop"]: value })
                  }
                  valueGbop={cr35Data.gbop}
                  onChangeGbot={(value) =>
                    setCr35Data({ ...cr35Data, ["gbot"]: value })
                  }
                  valueGbot={cr35Data.gbot}
                />
                <AppButton buttonName="Save" onPress={handleSaveCr35} />
              </View>
            )}
            {cr36Visible && (
              <View style={{ flex: 1, gap: wp(5) }}>
                <CrusherComponent
                  number={36}
                  colour="#7965C1"
                  onChangeStatus={(value) =>
                    setCr36Data({ ...cr36Data, ["status"]: value })
                  }
                  selectedStatus={cr36Data.status}
                  onChangeFeeder={(value) =>
                    setCr36Data({ ...cr36Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr36Data.feeder}
                  onChangeCurrent={(value) =>
                    setCr36Data({ ...cr36Data, ["current"]: value })
                  }
                  valueCurrent={cr36Data.current}
                  onChangeRpm={(value) =>
                    setCr36Data({ ...cr36Data, ["rpm"]: value })
                  }
                  valueRpm={cr36Data.rpm}
                  onChangeTcol={(value) =>
                    setCr36Data({ ...cr36Data, ["tcol"]: value })
                  }
                  selectedTcol={cr36Data.tcol}
                  onChangeTcop={(value) =>
                    setCr36Data({ ...cr36Data, ["tcop"]: value })
                  }
                  valueTcop={cr36Data.tcop}
                  onChangeTcot={(value) =>
                    setCr36Data({ ...cr36Data, ["tcot"]: value })
                  }
                  valueTcot={cr36Data.tcot}
                  onChangeGbol={(value) =>
                    setCr36Data({ ...cr36Data, ["gbol"]: value })
                  }
                  selectedGbol={cr36Data.gbol}
                  onChangeGbop={(value) =>
                    setCr36Data({ ...cr36Data, ["gbop"]: value })
                  }
                  valueGbop={cr36Data.gbop}
                  onChangeGbot={(value) =>
                    setCr36Data({ ...cr36Data, ["gbot"]: value })
                  }
                  valueGbot={cr36Data.gbot}
                />
                <AppButton buttonName="Save" onPress={handleSaveCr36} />
              </View>
            )}
            {cr37Visible && (
              <View style={{ flex: 1, gap: wp(5) }}>
                <CrusherComponent
                  number={37}
                  colour="#129990"
                  onChangeStatus={(value) =>
                    setCr37Data({ ...cr37Data, ["status"]: value })
                  }
                  selectedStatus={cr37Data.status}
                  onChangeFeeder={(value) =>
                    setCr37Data({ ...cr37Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr37Data.feeder}
                  onChangeCurrent={(value) =>
                    setCr37Data({ ...cr37Data, ["current"]: value })
                  }
                  valueCurrent={cr37Data.current}
                  onChangeRpm={(value) =>
                    setCr37Data({ ...cr37Data, ["rpm"]: value })
                  }
                  valueRpm={cr37Data.rpm}
                  onChangeTcol={(value) =>
                    setCr37Data({ ...cr37Data, ["tcol"]: value })
                  }
                  selectedTcol={cr37Data.tcol}
                  onChangeTcop={(value) =>
                    setCr37Data({ ...cr37Data, ["tcop"]: value })
                  }
                  valueTcop={cr37Data.tcop}
                  onChangeTcot={(value) =>
                    setCr37Data({ ...cr37Data, ["tcot"]: value })
                  }
                  valueTcot={cr37Data.tcot}
                  onChangeGbol={(value) =>
                    setCr37Data({ ...cr37Data, ["gbol"]: value })
                  }
                  selectedGbol={cr37Data.gbol}
                  onChangeGbop={(value) =>
                    setCr37Data({ ...cr37Data, ["gbop"]: value })
                  }
                  valueGbop={cr37Data.gbop}
                  onChangeGbot={(value) =>
                    setCr37Data({ ...cr37Data, ["gbot"]: value })
                  }
                  valueGbot={cr37Data.gbot}
                />
                <AppButton buttonName="Save" onPress={handleSaveCr37} />
              </View>
            )}
            {cr38Visible && (
              <View style={{ flex: 1, gap: wp(5) }}>
                <CrusherComponent
                  number={38}
                  colour="#DC8BE0"
                  onChangeStatus={(value) =>
                    setCr38Data({ ...cr38Data, ["status"]: value })
                  }
                  selectedStatus={cr38Data.status}
                  onChangeFeeder={(value) =>
                    setCr38Data({ ...cr38Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr38Data.feeder}
                  onChangeCurrent={(value) =>
                    setCr38Data({ ...cr38Data, ["current"]: value })
                  }
                  valueCurrent={cr38Data.current}
                  onChangeRpm={(value) =>
                    setCr38Data({ ...cr38Data, ["rpm"]: value })
                  }
                  valueRpm={cr38Data.rpm}
                  onChangeTcol={(value) =>
                    setCr38Data({ ...cr38Data, ["tcol"]: value })
                  }
                  selectedTcol={cr38Data.tcol}
                  onChangeTcop={(value) =>
                    setCr38Data({ ...cr38Data, ["tcop"]: value })
                  }
                  valueTcop={cr38Data.tcop}
                  onChangeTcot={(value) =>
                    setCr38Data({ ...cr38Data, ["tcot"]: value })
                  }
                  valueTcot={cr38Data.tcot}
                  onChangeGbol={(value) =>
                    setCr38Data({ ...cr38Data, ["gbol"]: value })
                  }
                  selectedGbol={cr38Data.gbol}
                  onChangeGbop={(value) =>
                    setCr38Data({ ...cr38Data, ["gbop"]: value })
                  }
                  valueGbop={cr38Data.gbop}
                  onChangeGbot={(value) =>
                    setCr38Data({ ...cr38Data, ["gbot"]: value })
                  }
                  valueGbot={cr38Data.gbot}
                />
                <AppButton buttonName="Save" onPress={handleSaveCr38} />
              </View>
            )}
          </ScrollView>
        </>
      )}
    </Formik>
  );
}
