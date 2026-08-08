import { View, ScrollView } from "react-native";
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
import EnterCrusherDetails from "./EnterCrusherDetails";
import CrusherAuthentication from "./CrusherAuthentication";
export default function ComplaintsHome({ navigation }) {
  const [enableCpp3, setEnableCpp3] = useState(false);
  const [enableCrusherDetails, setEnableCrusherDetails] = useState(false);
  const [enableAddComplaint, setEnableAddComplaint] = useState(false);
  const [enablePendingComplaints, setEnablePendingComplaints] = useState(false);
  const [enableDeleteComplaints, setEnableDeleteComplaints] = useState(false);
  const [enableSolvedComplaints, setEnableSolvedComplaints] = useState(false);
  const [authModelVisible, setAuthModelVisible] = useState(false);
  const [blendAuthModelVisible, setBlendAuthModelVisible] = useState(false);
  const [crusherAuthModelVisible, setCrusherAuthModelVisible] = useState(false);
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

  const handleBlendAuthClose = () => {
    setBlendAuthModelVisible(false);
  };

  const handleAddComplaint = () => {
    setEnableAddComplaint(true);
    setBlendAuthModelVisible(true);
  };
  const handlePendingComplaints = () => {
    //setEnablePendingComplaints(true);
    //setBlendAuthModelVisible(true);
    navigation.navigate("PendingComplaintType");
  };
  const handleSolvedComplaints = () => {
    //setEnableSolvedComplaints(true);
    //setBlendAuthModelVisible(true);
    navigation.navigate("SolvedComplaintType");
  };
  const handleDeleteComplaints = () => {
    setEnableDeleteComplaints(true);
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
          if (enableAddComplaint) {
            navigation.navigate("NewComplaintType");
            setEnableAddComplaint(false);
          } else if (
            enableDeleteComplaints &&
            responce.data.data[0].name == "Prasanna"
          ) {
            navigation.navigate("DeleteComplaintType");
            setEnableDeleteComplaints(false);
          } else alert("No permission to delete..");
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
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
        <View style={{ alignItems: "center", marginTop: hp(7) }}>
          <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>
            COMPLAINTS
          </Text>
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
          top: wp(20),
        }}
      >
        <Button
          title={"New Complaint"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 20, color: "white" }}
          radius={25}
          color="#65DCD5"
          onPress={handleAddComplaint} //{() => navigation.navigate("AddBlend")}
        ></Button>
        <Button
          title={"Pending Complaints"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 18, color: "white" }}
          radius={25}
          onPress={handlePendingComplaints}
          color="#E89951"
        ></Button>
        <Button
          title={"Solved Complaints"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 18, color: "white" }}
          radius={25}
          onPress={handleSolvedComplaints}
          color="#E89951"
        ></Button>
        <Button
          title={"Delete Complaints"}
          buttonStyle={{ width: 200, height: 60 }}
          titleStyle={{ fontSize: 18, color: "white" }}
          radius={25}
          onPress={handleDeleteComplaints}
          color="#E89951"
        ></Button>
        <BlendAuthentication
          onClose={handleBlendAuthClose}
          visible={blendAuthModelVisible}
          onSubmit={handleBlendAuthModelSubmit}
        />
      </View>
    </View>
  );
}
