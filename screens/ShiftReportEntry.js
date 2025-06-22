import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import { Button } from "@rneui/base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import DoneScreen from "./DoneScreen";
import axios from "axios";
import { FormatDate } from "../utils/FormatDate";

export default function ShiftReportEntry({ navigation }) {
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    credentials,
    setCredentials,
    reclaimingData,
    setReclaimingData,
    feedingData,
    setFeedingData,
    runningHoursData,
    setRunningHoursData,
    shiftDelaysData,
    setShiftDelaysData,
    mbTopStockData,
    setMbTopStockData,
    coalTowerStockData,
    setCoalTowerStockData,
    coalAnalysisData,
    setCoalAnalysisData,
    pushingScheduleData,
    setPushingScheduleData,
    allCrushersData,
    setAllCrushersData,
    globalDate,
    globalShift,
  } = useContext(GlobalContext);

  const currentDate =
    globalDate && new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift;

  let reclaimingStatus = false;
  let feedingStatus = false;
  let runningHoursStatus = false;
  let shiftDelaysStatus = false;
  let mbTopStockStatus = false;
  let coalTowerStockStatus = false;
  let coalAnalysisStatus = false;
  let pushingScheduleStatus = false;
  let credentialsStatus = false;
  let crusherDataStatus = false;

  let name = credentials.name;
  let empnum = credentials.empnum;

  let shiftReportEnteredBy = {
    date: currentDate,
    shift: currentShift,
    name: name,
    empnum: empnum,
    reportStatus: 1,
  };

  const handleFinalReport = async () => {
    if (
      reclaimingData &&
      feedingData &&
      runningHoursData &&
      shiftDelaysData &&
      mbTopStockData &&
      coalTowerStockData &&
      coalAnalysisData &&
      pushingScheduleData &&
      allCrushersData
    ) {
      setProgress(0);
      setDoneScreen(true);

      await axios
        .post(BaseUrl + "/reclaiming", reclaimingData)
        .then(function (response) {
          reclaimingStatus = true;

          setProgress(0.1);
        })
        .catch(function (error) {
          reclaimingStatus = false;
          console.log(error);
          alert("Could not save reclaiming data..");
        });

      await axios
        .post(BaseUrl + "/feeding", feedingData)
        .then((response) => {
          feedingStatus = true;

          setProgress(0.2);
        })
        .catch((error) => {
          feedingStatus = false;
          console.log(error);
          alert("Could not save Feeding data..");
        });

      await axios
        .post(BaseUrl + "/runningHours", runningHoursData)
        .then((responce) => {
          runningHoursStatus = true;

          setProgress(0.3);
        })
        .catch((error) => {
          runningHoursStatus = false;
          console.log(error);
          alert("Could not save running hours data..");
        });

      let count = shiftDelaysData.length;
      for (let i = 0; i < count; i++) {
        await axios
          .post(BaseUrl + "/shiftDelay", shiftDelaysData[i])
          .then((response) => {
            shiftDelaysStatus = true;

            setProgress(0.4);
          })
          .catch((error) => {
            shiftDelaysStatus = false;
            console.log(error);
            alert("Could not save shiftDelays data..");
          });
      }

      await axios
        .post(BaseUrl + "/mbtopStock", mbTopStockData)
        .then(function (response) {
          mbTopStockStatus = true;

          setProgress(0.5);
        })
        .catch(function (error) {
          mbTopStockStatus = false;
          console.log(error);
          alert("Could not save MbTop Stock data..");
        });

      await axios
        .post(BaseUrl + "/coaltowerstock", coalTowerStockData)
        .then((response) => {
          coalTowerStockStatus = true;

          setProgress(0.6);
        })
        .catch((error) => {
          coalTowerStockStatus = false;
          console.log(error);
          alert("Could not save Coal Tower Stock data..");
        });

      await axios
        .post(BaseUrl + "/coalAnalysis", coalAnalysisData)
        .then((response) => {
          coalAnalysisStatus = true;

          setProgress(0.7);
        })
        .catch((error) => {
          coalAnalysisStatus = false;
          console.log(error);
          alert("Could not save Coal Analysis data..");
        });

      await axios
        .post(BaseUrl + "/pushings", pushingScheduleData)
        .then((response) => {
          pushingScheduleStatus = true;

          setProgress(0.8);
        })
        .catch((error) => {
          pushingScheduleStatus = false;
          console.log(error);
          alert("Could not save Pushing schedule data..");
        });

      await axios
        .post(BaseUrl + "/crusher", allCrushersData)
        .then((response) => {
          crusherDataStatus = true;

          setProgress(0.85);
        })
        .catch((error) => {
          crusherDataStatus = false;
          console.log(error);
          alert("Could not save crusher status data..");
        });

      if (
        reclaimingStatus &&
        feedingStatus &&
        runningHoursStatus &&
        shiftDelaysStatus &&
        mbTopStockStatus &&
        coalTowerStockStatus &&
        coalAnalysisStatus &&
        pushingScheduleStatus &&
        crusherDataStatus
      ) {
        await axios
          .post(BaseUrl + "/shiftreportenteredby", shiftReportEnteredBy)
          .then(function (response) {
            credentialsStatus = true;

            setProgress(0.9);
          })
          .catch(function (error) {
            credentialsStatus = false;
            console.log(error);
            alert("Could not save Shift report entered by data..");
          });
      }
      setProgress(1);
    } else {
      alert("Enter all data..");
      return;
    }
    setReclaimingData(undefined);
    setFeedingData(undefined);
    setRunningHoursData(undefined);
    setShiftDelaysData(undefined);
    setMbTopStockData(undefined);
    setCoalTowerStockData(undefined);
    setCoalAnalysisData(undefined);
    setPushingScheduleData(undefined);
    setAllCrushersData(undefined);
    setTimeout(() => {
      navigation.navigate("ViewReports");
    }, 1000);
  };

  return (
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
            height: hp(25),
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
              gap: 40,
            }}
          >
            <AntDesign
              name="leftcircle"
              size={40}
              color="black"
              onPress={() => {
                setReclaimingData(undefined);
                setFeedingData(undefined);
                setRunningHoursData(undefined);
                setShiftDelaysData(undefined);
                setMbTopStockData(undefined);
                setCoalTowerStockData(undefined);
                setCoalAnalysisData(undefined);
                setPushingScheduleData(undefined);
                setAllCrushersData(undefined);
                navigation.goBack();
              }}
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
              Enter Shift Report
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
              SHIFT : {globalShift}
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
              {name}
            </Text>
            <Text
              style={{
                fontSize: hp(2.5),
                fontWeight: "bold",
                color: "#DF362D",
              }}
            >
              {empnum}
            </Text>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              position: "relative",
              zIndex: 1,
              alignItems: "center",
              marginTop: hp(30),
              gap: hp(4),
              marginBottom: hp(5),
            }}
          >
            <Button
              title={"Enter Reclaiming"}
              buttonStyle={{ width: wp(50), height: hp(7) }}
              titleStyle={{
                fontSize: hp(2.5),
                color: "black",
                fontWeight: "bold",
              }}
              radius={25}
              color="#50C4ED"
              onPress={() => navigation.navigate("EnterReclaiming")}
              disabled={reclaimingData === undefined ? false : true}
            ></Button>

            <Button
              title={"Enter Feeding"}
              buttonStyle={{ width: wp(40), height: hp(7) }}
              titleStyle={{
                fontSize: hp(2.5),
                color: "black",
                fontWeight: "bold",
              }}
              radius={25}
              color="#50C4ED"
              onPress={() => navigation.navigate("EnterFeeding")}
              disabled={feedingData === undefined ? false : true}
            ></Button>

            <Button
              title={" Enter Running Hours"}
              buttonStyle={{ width: wp(60), height: hp(7) }}
              titleStyle={{
                fontSize: hp(2.5),
                color: "black",
                fontWeight: "bold",
              }}
              radius={25}
              color="#50C4ED"
              onPress={() => navigation.navigate("EnterRunningHours")}
              disabled={runningHoursData === undefined ? false : true}
            ></Button>

            <Button
              title={"Enter MB-Top Stock"}
              buttonStyle={{ width: wp(60), height: hp(7) }}
              titleStyle={{
                fontSize: hp(2.5),
                color: "black",
                fontWeight: "bold",
              }}
              radius={25}
              color="#50C4ED"
              onPress={() => navigation.navigate("BinStock")}
              disabled={mbTopStockData === undefined ? false : true}
            ></Button>

            <Button
              title="Enter Coal-Tower Stock"
              buttonStyle={{ width: wp(70), height: hp(7) }}
              radius={50}
              color="#50C4ED"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("CoalTowerStock")}
              disabled={coalTowerStockData === undefined ? false : true}
            ></Button>

            <Button
              title="Enter Coal Analysis"
              buttonStyle={{ width: wp(60), height: hp(7) }}
              radius={50}
              color="#50C4ED"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("EnterCoalAnalysis")}
              disabled={coalAnalysisData === undefined ? false : true}
            ></Button>

            <Button
              title="Enter Pushing Schedule"
              buttonStyle={{ width: wp(70), height: hp(7) }}
              radius={50}
              color="#50C4ED"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("PushingSchedule")}
              disabled={pushingScheduleData === undefined ? false : true}
            ></Button>

            <Button
              title="Enter Crushers Status"
              buttonStyle={{ width: wp(70), height: hp(7) }}
              radius={50}
              color="#50C4ED"
              titleStyle={{
                color: "black",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
              onPress={() => navigation.navigate("CrusherStatus")}
              disabled={allCrushersData === undefined ? false : true}
            ></Button>

            <Button
              title={"Enter Delays"}
              buttonStyle={{ width: wp(40), height: hp(7) }}
              titleStyle={{
                fontSize: hp(2.5),
                color: "black",
                fontWeight: "bold",
              }}
              radius={25}
              color="#50C4ED"
              onPress={() => navigation.navigate("EnterDelays")}
              disabled={shiftDelaysData === undefined ? false : true}
            ></Button>

            <TouchableOpacity
              style={{
                height: hp(7),
                width: wp(40),
                backgroundColor: "#fcbf49",
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
                marginTop: hp(5),
              }}
              onPress={() =>
                navigation.navigate("Review", {
                  date: currentDate,
                  shift: currentShift,
                })
              }
              disabled={credentialsStatus}
            >
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Review
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: hp(7),
                width: wp(70),
                backgroundColor: "#fc5c65",
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleFinalReport}
              disabled={credentialsStatus}
            >
              <Text
                style={{
                  fontSize: hp(2.5),
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Send Final Report
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
