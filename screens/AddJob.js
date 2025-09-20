import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import { Button, Text } from "@rneui/base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ShiftReportAuthentication from "./ShiftReportAuthentication";
import { GlobalContext } from "../contextApi/GlobalContext";
import axios from "axios";
import shift from "../utils/Shift";
import BlendAuthentication from "./BlendAuthentication";

export default function AddJob({ navigation }) {
  const [enableCpp3, setEnableCpp3] = useState(false);
  const [authModelVisible, setAuthModelVisible] = useState(false);
  const [blendAuthModelVisible, setBlendAuthModelVisible] = useState(false);
  const [shiftReportEnteredBy, setShiftReportEnteredBy] = useState();
  const {
    credentials,
    setCredentials,
    globalDate,
    setGlobalDate,
    globalShift,
    setGlobalShift,
    addJobType,
    setAddJobType,
  } = useContext(GlobalContext);

  const handleAuthModelClose = () => {
    setAuthModelVisible(false);
  };
  const handleBlendAuthClose = () => {
    setBlendAuthModelVisible(false);
  };

  const handleEnterShiftReport = () => {
    setAuthModelVisible(true);
  };
  const handleEnterBlendCpp1 = () => {
    setBlendAuthModelVisible(true);
  };
  const handleEnterBlendCpp3 = () => {
    setEnableCpp3(true);
    setBlendAuthModelVisible(true);
  };

  const handleBlendAuthModelSubmit = async (empnum) => {
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          setCredentials(responce.data.data[0]);
          if (enableCpp3) {
            navigation.navigate("AddBlendCpp3");
            setEnableCpp3(false);
          } else {
            navigation.navigate("AddBlend");
          }
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
  };

  const handleAuthModelSubmit = async (empnum, selectedDate, selectedShift) => {
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          setCredentials(responce.data.data[0]);

          setReclaimingData(undefined);
          setFeedingData(undefined);
          setRunningHoursData(undefined);
          setShiftDelaysData(undefined);
          setMbTopStockData(undefined);
          setCoalTowerStockData(undefined);
          setCoalAnalysisData(undefined);
          setPushingScheduleData(undefined);
          setAllCrushersData(undefined);

          navigation.navigate("ShiftReportEntry");
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
    setGlobalDate(selectedDate);
    setGlobalShift(selectedShift);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: hp(15),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 35 }}>
          <Text h2>Add Job</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          top: wp(8),
        }}
      >
        <Button
          title={"Operational Job"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() => navigation.navigate("AddJobDetails")}
          color="#E3E587"
        ></Button>

        <Button
          title={"Mechanical Job"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() => navigation.navigate("AddJobDetails")}
          color="#E3E587"
        ></Button>

        <Button
          title={"Electrical Job"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() => navigation.navigate("AddJobDetails")}
          color="#E3E587"
        ></Button>

        <Button
          title={"Instrumentation Job"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() => navigation.navigate("AddJobDetails")}
          color="#E3E587"
        ></Button>

        <Button
          title={"Other Jobs"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() => navigation.navigate("AddJobDetails")}
          color="#E3E587"
        ></Button>
      </View>
    </View>
  );
}
