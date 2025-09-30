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

export default function Home({ navigation }) {
  const [enableCpp3, setEnableCpp3] = useState(false);
  const [enableAddJob, setEnableAddJob] = useState(false);
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
    setReclaimingData,
    setFeedingData,
    setRunningHoursData,
    setShiftDelaysData,
    setMbTopStockData,
    setCoalTowerStockData,
    setCoalAnalysisData,
    setPushingScheduleData,
    setAllCrushersData,
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
  const handleAddJob = () => {
    setEnableAddJob(true);
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
          if (enableAddJob) {
            navigation.navigate("AddJob");
            setEnableAddJob(false);
          } else if (enableCpp3) {
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
          height: hp(30),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 80 }}>
          <Text h2>Welcome To CPP</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          top: wp(10),
        }}
      >
        <Button
          title={"Enter Shift Reports"}
          buttonStyle={{ width: 200, height: 100, elevation: 20 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          color="#E3E587"
          onPress={handleEnterShiftReport}
        />

        <ShiftReportAuthentication
          onClose={handleAuthModelClose}
          visible={authModelVisible}
          onSubmit={handleAuthModelSubmit}
        />

        <Button
          title={"View Reports"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 20, color: "white" }}
          radius={25}
          onPress={() => navigation.navigate("ViewReports")}
        ></Button>

        <Button
          title={"Add Blend Cpp1"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 20, color: "white" }}
          radius={25}
          color="#FF8080"
          onPress={handleEnterBlendCpp1} //{() => navigation.navigate("AddBlend")}
        ></Button>
        <BlendAuthentication
          onClose={handleBlendAuthClose}
          visible={blendAuthModelVisible}
          onSubmit={handleBlendAuthModelSubmit}
        />

        <Button
          title={"Add Blend Cpp3"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 20, color: "white" }}
          radius={25}
          color="#FF8080"
          onPress={handleEnterBlendCpp3} //{() => navigation.navigate("AddBlend")}
        ></Button>
        <BlendAuthentication
          onClose={handleBlendAuthClose}
          visible={blendAuthModelVisible}
          onSubmit={handleBlendAuthModelSubmit}
        />

        {/*  <Button
          title={"Add New Job"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 20, color: "white" }}
          radius={25}
          color="#FF8080"
          onPress={handleAddJob} //{() => navigation.navigate("AddBlend")}
        ></Button>
        <BlendAuthentication
          onClose={handleBlendAuthClose}
          visible={blendAuthModelVisible}
          onSubmit={handleBlendAuthModelSubmit}
        />
        <Button
          title={"Show Pending Jobs"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 18, color: "white" }}
          radius={25}
          onPress={() => navigation.navigate("ViewReports")}
        ></Button>
      <Button
          title={"Crushers Report"}
          buttonStyle={{ width: 200, height: 100 }}
          titleStyle={{ fontSize: 25, color: "white" }}
          radius={25}
          onPress={() => navigation.navigate("CrushersDataEntry")}
        ></Button> */}
      </View>
    </View>
  );
}
