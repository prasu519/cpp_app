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
  const handleEnterBlend = () => {
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

          navigation.navigate("AddBlend");
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
          title={"Add Blend"}
          buttonStyle={{ width: 200, height: 100 }}
          titleStyle={{ fontSize: 25, color: "white" }}
          radius={25}
          color="#FF8080"
          onPress={handleEnterBlend} //{() => navigation.navigate("AddBlend")}
        ></Button>
        <BlendAuthentication
          onClose={handleBlendAuthClose}
          visible={blendAuthModelVisible}
          onSubmit={handleBlendAuthModelSubmit}
        />
        <Button
          title={"View Reports"}
          buttonStyle={{ width: 200, height: 100 }}
          titleStyle={{ fontSize: 25, color: "white" }}
          radius={25}
          onPress={() => navigation.navigate("ViewReports")}
        ></Button>
        {/* <Button
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
