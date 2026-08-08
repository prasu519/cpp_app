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

export default function NewComplaintType({ navigation }) {
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

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          height: hp(15),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View
          style={{
            alignItems: "center",
            height: hp(6),

            height: hp(10),
          }}
        >
          <Text
            style={{
              alignItems: "center",
              fontSize: hp(4),
              marginTop: hp(3),
            }}
          >
            New Complaint Type
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            width: wp(85),
            left: wp(8),
            flexDirection: "row",
            gap: wp(45),
          }}
        >
          <Text
            style={{
              alignItems: "center",
              fontSize: hp(2.5),
            }}
          >
            {credentials.empnum}
          </Text>
          <Text
            style={{
              alignItems: "center",
              fontSize: hp(2.5),
            }}
          >
            {credentials.name}
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
          gap: 40,
          top: wp(15),
        }}
      >
        {/* <Button
          title={"Housekeeping"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "hk" })
          }
          color="#E3E587"
        ></Button>*/}

        <Button
          title={"Operational"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "oper" })
          }
          color="#E3E587"
        ></Button>

        <Button
          title={"Mechanical"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "mech" })
          }
          color="#E3E587"
        ></Button>

        <Button
          title={"Electrical"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "elec" })
          }
          color="#E3E587"
        ></Button>

        <Button
          title={"Instrumentation"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "inst" })
          }
          color="#E3E587"
        ></Button>

        {/* <Button
          title={"Others"}
          buttonStyle={{ width: 250, height: 60 }}
          titleStyle={{ fontSize: 20, color: "black" }}
          radius={25}
          onPress={() =>
            navigation.navigate("EnterComplaintDetails", { type: "other" })
          }
          color="#E3E587"
        ></Button>*/}
      </View>
    </View>
  );
}
