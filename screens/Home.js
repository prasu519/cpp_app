import { View } from "react-native";
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

export default function Home({ navigation }) {
  const { credentials, setCredentials } = useContext(GlobalContext);
  const [authModelVisible, setAuthModelVisible] = useState(false);
  const [shiftReportEnteredBy, setShiftReportEnteredBy] = useState();

  const currentDate = new Date().toISOString().split("T")[0];
  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    const getShiftReportEntryDetails = async () => {
      await axios
        .get(BaseUrl + "/shiftreportenteredby", {
          params: {
            date: currentDate,
            shift: currentShift,
          },
        })
        .then((responce) => setShiftReportEnteredBy(responce.data.data[0]))
        .catch((error) => console.log(error));
    };
    getShiftReportEntryDetails();
  }, [handleEnterShiftReport]);

  const handleAuthModelClose = () => {
    setAuthModelVisible(false);
  };

  const handleEnterShiftReport = () => {
    if (shiftReportEnteredBy === undefined) setAuthModelVisible(true);
    else
      alert(
        currentDate +
          " , " +
          currentShift +
          " - Shift Report has already been entered by [ " +
          shiftReportEnteredBy.name +
          " - " +
          shiftReportEnteredBy.empnum +
          " ]"
      );
  };

  const handleAuthModelSubmit = async (empnum) => {
    // Handle the submitted input
    console.log("Submitted input:", empnum);
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          setCredentials(responce.data.data[0]);
          console.log(responce.data.data[0]);
          navigation.navigate("ShiftReportEntry");
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
          height: hp(35),
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
          gap: 40,
        }}
      >
        <Button
          title={"Enter Shift Reports"}
          buttonStyle={{ width: 200, height: 100 }}
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
          title={"Add Blend"}
          buttonStyle={{ width: 200, height: 100 }}
          titleStyle={{ fontSize: 25, color: "white" }}
          radius={25}
          color="#FF8080"
          onPress={() => navigation.navigate("AddBlend")}
        ></Button>
        <Button
          title={"View Reports"}
          buttonStyle={{ width: 200, height: 100 }}
          titleStyle={{ fontSize: 25, color: "white" }}
          radius={25}
          onPress={() => navigation.navigate("ViewReports")}
        ></Button>
      </View>
    </View>
  );
}
