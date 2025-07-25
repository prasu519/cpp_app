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

  const [cr34Data, setCr34Data] = useState({});
  const [cr35Data, setCr35Data] = useState({});
  const [cr36Data, setCr36Data] = useState({});
  const [cr37Data, setCr37Data] = useState({});
  const [cr38Data, setCr38Data] = useState({});

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift; //shift(new Date().getHours());

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

    const allCrushersDatatemp = {
      date: currentDate,
      shift: currentShift,
    };

    const crData = {
      date: currentDate,
      shift: currentShift,
      cr34status: cr34Data.status,
      cr34feeder: cr34Data.feeder,
      cr35status: cr35Data.status,
      cr35feeder: cr35Data.feeder,
      cr36status: cr36Data.status,
      cr36feeder: cr36Data.feeder,
      cr37status: cr37Data.status,
      cr37feeder: cr37Data.feeder,
      cr38status: cr38Data.status,
      cr38feeder: cr38Data.feeder,
    };
    const updatedData = {
      ...allCrushersData,
      ...crData,
    };
    await setAllCrushersData(updatedData);

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
                  selectedStatus={cr34Data.status}
                  onChangeFeeder={(value) =>
                    setCr34Data({ ...cr34Data, ["feeder"]: value })
                  }
                  selectedFeeder={cr34Data.feeder}
                />
              </View>

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
                />
              </View>

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
                />
              </View>

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
                />
              </View>

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
                />
              </View>
              <AppButton buttonName="Save" onPress={handleSaveCr} />
            </ScrollView>
          </View>
        </>
      )}
    </Formik>
  );
}
