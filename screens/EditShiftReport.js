import { View, ScrollView, TextInput } from "react-native";
import { Text } from "@rneui/themed";
import React, { useEffect, useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";
import axios from "axios";
import { Switch } from "@rneui/themed";
import AppButton from "../components/AppButton";
import BaseUrl from "../config/BaseUrl";
import AppDropdown from "../components/AppDropdown";
import DelayMessageComponent from "../components/DelayMessageComponent"; //1480,2140,180
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GlobalContext } from "../contextApi/GlobalContext";
import { FormatDate } from "../utils/FormatDate";
import CrusherEdit from "../components/CrusherEdit";
import DoneScreen from "./DoneScreen";

export default function EditShiftReport({ navigation }) {
  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();
  const [runningHours, setRunningHours] = useState();
  const [shiftDelays, setShiftDelays] = useState([]);
  const [newshiftDelays, setNewShiftDelays] = useState([]);
  const [delayComponent, setDelayComponent] = useState({});
  const [coalNames, setCoalNames] = useState({});
  const [mbtopCoalData, setMbtopCoalData] = useState();
  const [coalTowerStock, setCoalTowerStock] = useState();
  const [coalAnalysis, setCoalAnalysis] = useState();
  const [pushingSchedule, setPushingSchedule] = useState();
  const [crusherStatus, setCrusherStatus] = useState();

  const [editFeeding, setEditFeeding] = useState(false);
  const [editReclaiming, setEditReclaiming] = useState(false);
  const [editRunningHours, setEditRunningHours] = useState(false);
  const [editShiftDelays, setEditShiftDelays] = useState(false);
  const [editMbtopStock, setEditMbtopStock] = useState(false);
  const [editCoalTowerStock, setEditCoalTowerStock] = useState(false);
  const [editCoalAnalysis, setEditCoalAnalysis] = useState(false);
  const [editPushingSchedule, setEditPushingSchedule] = useState(false);
  const [editCrusherStatus, setEditCrusherStatus] = useState(false);

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [reclaimingCount, setReclaimingCount] = useState(0);
  const [coalNameCount, setCoalNameCount] = useState();

  const [updateFeedButtVisible, setUpdateFeedButtVisible] = useState(false);
  const [updateReclButtVisible, setUpdateReclButtVisible] = useState(false);
  const [updateRunnHrsButtVisible, setUpdateRunnhrsHButtVisible] =
    useState(false);
  const [updateShiftDelayButtonVisible, setUpdateShiftDelayButtonVisible] =
    useState(true);
  const [updateMbtopStockButtVisible, setUpdateMbtopStockButtVisible] =
    useState(false);
  const [updateCoalTowerStockButtVisible, setUpdateCoalTowerStockButtVisible] =
    useState(false);
  const [updateCoalAnalysisButtVisible, setUpdateCoalAnalysisButtVisible] =
    useState(false);
  const [
    updatePushingScheduleButtVisible,
    setUpdatePushingScheduleButtVisible,
  ] = useState(false);
  const [updateCrusherStatusButtVisible, setUpdateCrusherStatusButtVisible] =
    useState(false);

  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const {
    reclaimingData,
    setReclaimingData,
    feedingData,
    setFeedingData,
    runningHoursData,
    shiftDelaysData,
    setShiftDelaysData,
    mbTopStockData,
    setMbTopStockData,
    coalTowerStockData,
    setCoalTowerStockData,
    coalAnalysisData,
    pushingScheduleData,
    setPushingScheduleData,
    allCrushersData,
    globalDate,
    globalShift,
  } = useContext(GlobalContext);

  const currentDate = new Date(globalDate).toISOString().split("T")[0];
  const currentShift = globalShift;

  useEffect(() => {
    if (isLoaded) {
      getCoalNames();
      getTotalCoals();
      getfeedingdata();
      getReclaimingData();
      getRunningHoursdata();
      getShiftDelayData();
      getMbTopCoalData();
      getCoalTowerStock();
      getCoalAnalysisData();
      getPushingScheduleData();
      getCrusherStatusData();
    }
  }, []);

  useEffect(() => {
    if (runningHours == undefined) return;
    checkIsRunningHoursNull();
  }, [runningHours]);

  useEffect(() => {
    if (shiftDelays == undefined) return;
    copyShiftDelayData();
  }, [shiftDelays]);

  const getTotalCoals = async () => {
    await axios
      .get(BaseUrl + "/blend", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((response) => {
        setReclaimingCount(response.data.data[0].total);
      })
      .catch((error) => console.log(error));
  };

  const getfeedingdata = async () => {
    setFeeding(feedingData);
    setIsLoaded(false);
  };

  const getReclaimingData = async () => {
    setReclaiming(reclaimingData);
    setIsLoaded(false);
  };

  const getRunningHoursdata = async () => {
    setRunningHours(runningHoursData);
    setIsLoaded(false);
  };

  const getShiftDelayData = async () => {
    setShiftDelays(shiftDelaysData);
    setIsLoaded(false);
  };

  const copyShiftDelayData = () => {
    let totalDelays = shiftDelays.length;
    let tempobj = {};
    for (let i = 0; i < totalDelays; i++) {
      let fromTime = shiftDelays[i].fromTime.split(":");
      let toTime = shiftDelays[i].toTime.split(":");
      let fromhr = fromTime[0].trim();
      let frommin = fromTime[1].trim();
      let tohr = toTime[0].trim();
      let tomin = toTime[1].trim();
      let desc = shiftDelays[i].reason;
      tempobj = {
        ...tempobj,
        [`fromhr${i}`]: fromhr,
        [`frommin${i}`]: frommin,
        [`tohr${i}`]: tohr,
        [`tomin${i}`]: tomin,
        [`desc${i}`]: desc,
      };
    }
    setDelayComponent(tempobj);
    setIsDataLoaded(true);
  };

  const getCoalNames = async () => {
    await axios
      .get(BaseUrl + "/blend", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((response) => {
        setCoalNames(response.data.data[0]);
        setCoalNameCount(response.data.data[0].total);
      })
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getMbTopCoalData = async () => {
    setMbtopCoalData(mbTopStockData);
    setIsLoaded(false);
  };

  const getCoalTowerStock = async () => {
    setCoalTowerStock(coalTowerStockData);

    setIsLoaded(false);
  };

  const getCoalAnalysisData = async () => {
    setCoalAnalysis(coalAnalysisData);
    setIsLoaded(false);
  };

  const getPushingScheduleData = async () => {
    setPushingSchedule(pushingScheduleData);
    setIsLoaded(false);
  };

  const getCrusherStatusData = async () => {
    setCrusherStatus(allCrushersData);
    setIsLoaded(false);
  };

  const onUpdateFeeding = async () => {
    const totalFeeding =
      parseInt(feeding.ct1) + parseInt(feeding.ct2) + parseInt(feeding.ct3);
    const streamTotal =
      parseInt(feeding.stream1) +
      parseInt(feeding.stream1A) +
      parseInt(feeding.pathc);
    const autoTotal = parseInt(feeding.auto) + parseInt(feeding.nonauto);

    if (totalFeeding !== streamTotal) {
      alert("Coal Tower total and Stream total should be equal..");
      return;
    }

    if (totalFeeding !== autoTotal) {
      alert("Coal Tower total and Auto group should be equal..");
      return;
    }
    const updatedFeeding = {
      ...feeding,
      total_feeding: totalFeeding,
    };
    setFeedingData(updatedFeeding);
    await axios
      .put(BaseUrl + "/feeding", updatedFeeding)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
        alert("Could not edit Feeding data..");
      });
    setEditFeeding(false);
  };

  const onUpdateReclaiming = async () => {
    const streamtotal =
      parseInt(reclaiming.cc49recl) +
      parseInt(reclaiming.cc50recl) +
      parseInt(reclaiming.cc126recl);
    let coaltotal = 0;
    for (let i = 1; i <= 8; i++) {
      coaltotal =
        coaltotal +
        parseInt(reclaiming["coal" + i + "recl"]) +
        parseInt(reclaiming["excoal" + i + "recl"]);
    }
    if (coaltotal !== streamtotal) {
      alert("CPP1 CoalTotal and StreamTotal should be equal..");
      return;
    }
    const cpp3streamtotal =
      parseInt(reclaiming.patharecl) + parseInt(reclaiming.pathbrecl);
    let cpp3coaltotal = 0;
    for (let i = 1; i <= 6; i++) {
      cpp3coaltotal =
        cpp3coaltotal + parseInt(reclaiming["cpp3coal" + i + "recl"]);
    }
    if (cpp3coaltotal !== cpp3streamtotal) {
      alert("CPP3 CoalTotal and StreamTotal should be equal..");
      return;
    }
    const updatedReclaiming = {
      ...reclaiming,
      total_reclaiming: streamtotal,
      cpp3total_reclaiming: cpp3streamtotal,
    };
    setReclaimingData(updatedReclaiming);
    await axios
      .put(BaseUrl + "/reclaiming", updatedReclaiming)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
        alert("Could not edit reclaiming data..");
      });
    setEditReclaiming(false);
  };

  const onUpdateRunningHours = async () => {
    await axios
      .put(BaseUrl + "/runningHours", runningHours)
      .then((responce) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not edit running hours data..");
      });
    setEditRunningHours(false);
  };

  const checkIsRunningHoursNull = () => {
    for (let i = 2; i <= 4; i++) {
      if (
        runningHours["str" + i + "hrs"] === "" ||
        runningHours["str" + i + "min"] === ""
      ) {
        alert("Make sure to enter all values..");
        setUpdateRunnhrsHButtVisible(true);
        return;
      }
    }
    if (
      runningHours["cc49hrs"] === "" ||
      runningHours["cc49min"] === "" ||
      runningHours["cc50hrs"] === "" ||
      runningHours["cc50min"] === "" ||
      runningHours["cc126hrs"] === "" ||
      runningHours["cc126min"] === ""
    ) {
      alert("Make sure to enter all values..");
      setUpdateRunnhrsHButtVisible(true);
      return;
    } else {
      setUpdateRunnhrsHButtVisible(false);
      return;
    }
  };

  const handleDeleteDelay = async (delaynumber) => {
    const updatedDelayComponents = shiftDelays.filter(
      (_, i) => i != delaynumber
    );
    setShiftDelays(updatedDelayComponents);
    const tempObject = { ...delayComponent };
    delete tempObject["fromhr" + delaynumber];
    delete tempObject["frommin" + delaynumber];
    delete tempObject["tohr" + delaynumber];
    delete tempObject["tomin" + delaynumber];
    delete tempObject["desc" + delaynumber];
    setDelayComponent(tempObject);
    const count = shiftDelays.length;
    for (let i = 0; i < count - 1; i++) {
      newshiftDelays[i] = {
        date: currentDate,
        shift: currentShift,
        delayNumber: i + 1,
        fromTime:
          i >= delaynumber
            ? delayComponent["fromhr" + (i + 1)] +
              ":" +
              delayComponent["frommin" + (i + 1)]
            : delayComponent["fromhr" + i] +
              ":" +
              delayComponent["frommin" + i],
        toTime:
          i >= delaynumber
            ? delayComponent["tohr" + (i + 1)] +
              ":" +
              delayComponent["tomin" + (i + 1)]
            : delayComponent["tohr" + i] + ":" + delayComponent["tomin" + i],
        reason:
          i >= delaynumber
            ? delayComponent["desc" + (i + 1)]
            : delayComponent["desc" + i],
      };
    }
    let deleteDelayNumber = delaynumber + 1;
    let shiftDelaysNew = shiftDelays.filter(
      (sd) => sd.delayNumber != deleteDelayNumber
    );
    setShiftDelaysData(shiftDelaysNew);
  };

  const onUpdateShiftDelays = async () => {
    const count = shiftDelays.length;
    for (let i = 0; i < count; i++) {
      shiftDelays[i] = {
        date: currentDate,
        shift: currentShift,
        delayNumber: i + 1,
        fromTime:
          delayComponent["fromhr" + i] + ":" + delayComponent["frommin" + i],
        toTime: delayComponent["tohr" + i] + ":" + delayComponent["tomin" + i],
        reason: delayComponent["desc" + i],
      };
    }
    for (let i = 0; i < count; i++) {
      await axios
        .put(BaseUrl + "/shiftDelay", shiftDelays[i])
        .then((response) => {})
        .catch((error) => {
          console.log(error);
          alert("Could not edit shiftDelays data..");
        });
    }
    setEditShiftDelays(false);
  };

  const onUpdateMbtopStock = async () => {
    let totalMbtopStock = 0;
    let cpp3totalMbtopStock = 0;
    for (let i = 0; i < coalNameCount; i++) {
      totalMbtopStock =
        totalMbtopStock +
        parseInt(mbtopCoalData["coal" + (i + 1) + "stock"]) +
        parseInt(mbtopCoalData["oldcoal" + (i + 1) + "stock"]);
    }
    for (let i = 0; i < 6; i++) {
      cpp3totalMbtopStock =
        cpp3totalMbtopStock +
        parseInt(mbtopCoalData["cpp3coal" + (i + 1) + "stock"]);
    }
    const newMbtopData = {
      ...mbtopCoalData,
      total_stock: totalMbtopStock,
      cpp3total_stock: cpp3totalMbtopStock,
    };
    setMbTopStockData(newMbtopData);
    await axios
      .put(BaseUrl + "/mbtopStock", newMbtopData)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
        alert("Could not edit MbTop Stock data..");
      });
    setEditMbtopStock(false);
  };

  const onUpdateCoalTowerStock = async () => {
    const totalCoalTowerStock =
      parseInt(coalTowerStock.ct1stock) +
      parseInt(coalTowerStock.ct2stock) +
      parseInt(coalTowerStock.ct3stock);

    const updatedCoalTowerStock = {
      ...coalTowerStock,
      total_stock: totalCoalTowerStock,
    };
    setCoalTowerStockData(updatedCoalTowerStock);
    await axios
      .put(BaseUrl + "/coaltowerstock", updatedCoalTowerStock)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not edit Coal Tower Stock data..");
      });
    setEditCoalTowerStock(false);
  };

  const onUpdateCoalAnalysis = async () => {
    let totalofAVF =
      parseFloat(coalAnalysis.ash) +
      parseFloat(coalAnalysis.vm) +
      parseFloat(coalAnalysis.fc);
    if (totalofAVF != 100) {
      alert("Total of Ash,Vm,Fc should be 100..");
      return;
    }
    await axios
      .put(BaseUrl + "/coalAnalysis", coalAnalysis)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not edit Coal Analysis data..");
      });
    setEditCoalAnalysis(false);
  };

  const onUpdatePushingSchedule = async () => {
    let ptotal = 0;
    ptotal =
      parseInt(pushingSchedule.bat1) +
      parseInt(pushingSchedule.bat2) +
      parseInt(pushingSchedule.bat3) +
      parseInt(pushingSchedule.bat4) +
      parseInt(pushingSchedule.bat5);
    let newValues = { ...pushingSchedule, total_pushings: ptotal.toString() };

    setPushingScheduleData(newValues);
    await axios
      .put(BaseUrl + "/pushings", newValues)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not edit Pushing schedule data..");
      });
    setEditPushingSchedule(false);
  };

  const onUpdateCrusherStatus = async () => {
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

    if (crusherStatus.cr34status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (crusherStatus.cr34feeder === "1") {
        cr34f1coal = crsdcoal;
        cr34f2coal = 0;
      } else {
        cr34f2coal = crsdcoal;
        cr34f1coal = 0;
      }
    }

    if (crusherStatus.cr35status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (crusherStatus.cr35feeder === "1") {
        cr35f1coal = crsdcoal;
        cr35f2coal = 0;
      } else {
        cr35f2coal = crsdcoal;
        cr35f1coal = 0;
      }
    }
    if (crusherStatus.cr36status === "InUse") {
      let crsdcoal = feedingData.stream1 / 2;
      if (crusherStatus.cr36feeder === "1") {
        cr36f1coal = crsdcoal;
        cr36f2coal = 0;
      } else {
        cr36f2coal = crsdcoal;
        cr36f1coal = 0;
      }
    }
    if (
      crusherStatus.cr37status === "InUse" &&
      crusherStatus.cr38status === "InUse"
    ) {
      let crsdcoal = feedingData.stream1A / 2;
      if (crusherStatus.cr37feeder === "1") {
        cr37f1coal = crsdcoal;
        cr37f2coal = 0;
      } else {
        cr37f2coal = crsdcoal;
        cr37f1coal = 0;
      }
      if (crusherStatus.cr38feeder === "1") {
        cr38f1coal = crsdcoal;
        cr38f2coal = 0;
      } else {
        cr38f2coal = crsdcoal;
        cr38f1coal = 0;
      }
    }
    if (
      crusherStatus.cr37status === "InUse" &&
      crusherStatus.cr38status !== "InUse"
    ) {
      let crsdcoal = feedingData.stream1A;
      if (crusherStatus.cr37feeder === "1") {
        cr37f1coal = crsdcoal;
        cr37f2coal = 0;
      } else {
        cr37f2coal = crsdcoal;
        cr37f1coal = 0;
      }
      if (crusherStatus.cr38feeder === "1") {
        cr38f1coal = 0;
        cr38f2coal = 0;
      } else {
        cr38f2coal = 0;
        cr38f1coal = 0;
      }
    }
    if (
      crusherStatus.cr37status !== "InUse" &&
      crusherStatus.cr38status === "InUse"
    ) {
      let crsdcoal = feedingData.stream1A;
      if (crusherStatus.cr37feeder === "1") {
        cr37f1coal = 0;
        cr37f2coal = 0;
      } else {
        cr37f2coal = 0;
        cr37f1coal = 0;
      }
      if (crusherStatus.cr38feeder === "1") {
        cr38f1coal = crsdcoal;
        cr38f2coal = 0;
      } else {
        cr38f2coal = crsdcoal;
        cr38f1coal = 0;
      }
    }
    if (
      crusherStatus.cr37status !== "InUse" &&
      crusherStatus.cr38status !== "InUse"
    ) {
      cr37f1coal = 0;
      cr37f2coal = 0;
      cr38f1coal = 0;
      cr38f2coal = 0;
    }

    let finalCrusherData = {
      ...crusherStatus,
      ["cr34feeder1coal"]: cr34f1coal,
      ["cr34feeder2coal"]: cr34f2coal,
      ["cr35feeder1coal"]: cr35f1coal,
      ["cr35feeder2coal"]: cr35f2coal,
      ["cr36feeder1coal"]: cr36f1coal,
      ["cr36feeder2coal"]: cr36f2coal,
      ["cr37feeder1coal"]: cr37f1coal,
      ["cr37feeder2coal"]: cr37f2coal,
      ["cr38feeder1coal"]: cr38f1coal,
      ["cr38feeder2coal"]: cr38f2coal,
    };

    /* let fdate = crusherStatus.date;
    let fshift = crusherStatus.shift;
    await axios
      .delete(BaseUrl + "/crusher", {
        params: {
          date: fdate,
          shift: fshift,
        },
      })
      .then((responce) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not delete crusher data from crusher edit..");
      });

    await axios
      .post(BaseUrl + "/crusher", finalCrusherData)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not save crusher data from crusher edit..");
      });*/

    await axios
      .put(BaseUrl + "/crusher", finalCrusherData)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
        alert("Could not edit crusher status data..");
      });
    setEditCrusherStatus(false);
  };

  const toggleSwitchFeeding = () => {
    setEditFeeding((previousState) => !previousState);
  };
  const toggleSwitchReclaiming = () => {
    setEditReclaiming((previousState) => !previousState);
  };
  const toggleSwitchRunningHours = () => {
    setEditRunningHours((previousState) => !previousState);
  };
  const toggleSwitchShiftDelays = () => {
    setEditShiftDelays((previousState) => !previousState);
  };
  const toggleSwitchMbtopStock = () => {
    setEditMbtopStock((previousState) => !previousState);
  };
  const toggleSwitchCoalTowerStock = () => {
    setEditCoalTowerStock((previousState) => !previousState);
  };
  const toggleSwitchCoalAnalysis = () => {
    setEditCoalAnalysis((previousState) => !previousState);
  };
  const toggleSwitchPushingSchedule = () => {
    setEditPushingSchedule((previousState) => !previousState);
  };
  const toggleSwitchCrusherStatus = () => {
    setEditCrusherStatus((previousState) => !previousState);
  };

  const handleBackButton = async () => {
    if (
      editReclaiming ||
      editFeeding ||
      editShiftDelays ||
      editRunningHours ||
      editMbtopStock ||
      editCoalTowerStock ||
      editCoalAnalysis ||
      editPushingSchedule ||
      editCrusherStatus
    ) {
      alert("Update all data..");
      return;
    } else {
      const currentDate = new Date(globalDate).toISOString().split("T")[0];
      const shiftReportEditedBy = {
        date: currentDate,
        shift: globalShift,
        reportStatus: 2,
      };
      await axios
        .put(BaseUrl + "/shiftreportenteredby", shiftReportEditedBy)
        .then(function (response) {
          credentialsStatus = true;

          setProgress(0.9);
        })
        .catch(function (error) {
          credentialsStatus = false;
          console.log(error);
          alert("Could not edit Shift report entered by data..");
        });
    }

    setTimeout(() => {
      navigation.navigate("ShiftReportView");
    }, 1000);
  };

  if (
    isLoaded ||
    feeding == undefined ||
    reclaiming == undefined ||
    runningHours == undefined ||
    shiftDelays == undefined ||
    mbtopCoalData == undefined ||
    coalTowerStock == undefined ||
    coalNames == undefined ||
    coalAnalysis == undefined ||
    pushingSchedule == undefined ||
    crusherStatus == undefined
  ) {
    return (
      <View style={{ flex: 1 }}>
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
              gap: hp(12),
            }}
          >
            <AntDesign
              name="leftcircle"
              size={40}
              color="black"
              onPress={() => {
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
              Edit Shift Report
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
              SHIFT : {currentShift}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: hp(20),
            paddingTop: hp(2),
            gap: hp(2),
          }}
        >
          {!reclaiming && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              reclaiming Report not entered
            </Text>
          )}
          {!feeding && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              feeding Report not entered
            </Text>
          )}
          {!runningHours && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              runningHours Report not entered
            </Text>
          )}
          {!shiftDelays && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              shiftDelays Report not entered
            </Text>
          )}
          {!mbtopCoalData && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              mbtopCoalData Report not entered
            </Text>
          )}
          {!coalTowerStock && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              coalTowerStock Report not entered
            </Text>
          )}
          {!coalAnalysis && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              coalAnalysis Report not entered
            </Text>
          )}
          {!pushingSchedule && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              pushingSchedule Report not entered
            </Text>
          )}
          {!crusherStatus && (
            <Text
              style={{ alignSelf: "center", fontSize: hp(2), color: "red" }}
            >
              crusherStatus Report not entered
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <>
      <DoneScreen
        progress={progress}
        onDone={() => setDoneScreen(false)}
        visible={doneScreen}
      />

      <View style={{ flex: 1, gap: 30 }}>
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
              paddingTop: hp(5),
              paddingLeft: hp(2),
              flexDirection: "row",
              alignItems: "center",
              gap: hp(8),
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
              Edit Shift Report
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
              DATE : {currentDate}
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
        <ScrollView
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: hp(20),
            padding: hp(2),
          }}
        >
          <FieldSet label="Reclaiming Data">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Reclaiming
              </Text>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                reclaiming["coal" + item + "name"] === null ||
                reclaiming["coal" + item + "recl"] === 0 ? null : (
                  <AppTextBox
                    key={index}
                    label={reclaiming["coal" + item + "name"]}
                    labelcolor="orange"
                    value={reclaiming["coal" + item + "recl"].toString()}
                    onChangeText={(newValue) => {
                      if (newValue === "") {
                        setUpdateReclButtVisible(true);
                        setReclaiming({
                          ...reclaiming,
                          ["coal" + item + "recl"]: "",
                        });
                        return;
                      }
                      if (!/^[0-9]*$/.test(newValue)) {
                        alert("Enter Numbers only...");
                        return;
                      } else {
                        setUpdateReclButtVisible(false);
                        setReclaiming({
                          ...reclaiming,
                          ["coal" + item + "recl"]: newValue,
                        });
                      }
                    }}
                    editable={editReclaiming}
                  />
                )
              )}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                reclaiming["excoal" + item + "name"] === null ||
                reclaiming["excoal" + item + "recl"] === 0 ? null : (
                  <AppTextBox
                    key={index}
                    label={reclaiming["excoal" + item + "name"]}
                    labelcolor="#ffd900"
                    value={reclaiming["excoal" + item + "recl"].toString()}
                    onChangeText={(newValue) => {
                      if (newValue === "") {
                        setUpdateReclButtVisible(true);
                        setReclaiming({
                          ...reclaiming,
                          ["excoal" + item + "recl"]: "",
                        });
                        return;
                      }
                      if (!/^[0-9]*$/.test(newValue)) {
                        alert("Enter Numbers only...");
                        return;
                      } else {
                        setUpdateReclButtVisible(false);
                        setReclaiming({
                          ...reclaiming,
                          ["excoal" + item + "recl"]: newValue,
                        });
                      }
                    }}
                    editable={editReclaiming}
                  />
                )
              )}
              {["cc49", "cc50", "cc126"].map((item, index) => (
                <AppTextBox
                  key={index}
                  label={item}
                  labelcolor="#e9c46a"
                  value={reclaiming[item + "recl"].toString()}
                  onChangeText={(newValue) => {
                    if (newValue === "") {
                      setUpdateReclButtVisible(true);
                      setReclaiming({
                        ...reclaiming,
                        [item + "recl"]: "",
                      });
                      return;
                    }
                    if (!/^[0-9]*$/.test(newValue)) {
                      alert("Enter Numbers only...");
                      return;
                    } else {
                      setUpdateReclButtVisible(false);
                      setReclaiming({
                        ...reclaiming,
                        [item + "recl"]: newValue,
                      });
                    }
                  }}
                  editable={editReclaiming}
                />
              ))}
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(2.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                  marginTop: hp(3),
                }}
              >
                CPP3 Reclaiming
              </Text>
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderRadius: 25,
                    width: wp(30),
                    height: hp(6),
                    marginLeft: wp(5),
                    borderRadius: 20,
                    gap: wp(5),
                    marginBottom: wp(10),
                  }}
                >
                  <Picker
                    id={index}
                    style={{
                      width: wp(35),
                      borderWidth: wp(1),
                      backgroundColor: "white",
                    }}
                    mode="dropdown"
                    onValueChange={(value) => {
                      setReclaiming({
                        ...reclaiming,
                        ["cpp3coal" + item + "name"]: value.toUpperCase(),
                      });
                    }}
                    enabled={editReclaiming}
                    selectedValue={reclaiming["cpp3coal" + item + "name"]}
                  >
                    {["Coal", "GYC", "BWS", "MCC", "BROOKS"].map((coal) => (
                      <Picker.Item
                        key={coal}
                        label={coal.toString()}
                        value={coal}
                        style={{ fontSize: hp(2.5) }}
                      />
                    ))}
                  </Picker>
                  <TextInput
                    selectionColor={"black"}
                    style={{
                      height: hp(6),
                      width: wp(30),
                      paddingLeft: wp(2),
                      fontSize: hp(3),
                      fontFamily: "Roboto",
                      borderWidth: wp(0.3),
                      borderRadius: 10,
                      borderColor: "#0c0c0c",
                      backgroundColor: "white",
                    }}
                    keyboardType="number-pad"
                    placeholder="Tons"
                    value={reclaiming["cpp3coal" + item + "recl"].toString()}
                    onChangeText={(value) => {
                      if (!/^[0-9]*$/.test(value)) {
                        alert("Enter Numbers only...");
                        return;
                      } else {
                        setReclaiming({
                          ...reclaiming,
                          ["cpp3coal" + item + "recl"]: value,
                        });

                        /* const cpp3CoalTotal = [...cpp3TotalValues];
                        cpp3CoalTotal[index] = value;
                        setCpp3TotalValues(cpp3CoalTotal);
                        const total = cpp3CoalTotal.reduce(
                          (sum, val) => sum + (parseInt(val) || 0),
                          0
                        );
                        setCpp3TotalReclaiming(total);*/
                      }
                    }}
                    selectedValue={reclaiming["cpp3coal" + item + "recl"]}
                    editable={editReclaiming}
                  />
                </View>
                /* reclaiming["cpp3coal" + item + "name"] === null ||
                reclaiming["cpp3coal" + item + "recl"] === 0 ? null : (
                  <AppTextBox
                    key={index}
                    label={reclaiming["cpp3coal" + item + "name"]}
                    labelcolor="orange"
                    value={reclaiming["cpp3coal" + item + "recl"].toString()}
                    onChangeText={(newValue) => {
                      if (newValue === "") {
                        setUpdateReclButtVisible(true);
                        setReclaiming({
                          ...reclaiming,
                          ["cpp3coal" + item + "recl"]: "",
                        });
                        return;
                      }
                      if (!/^[0-9]*$/.test(newValue)) {
                        alert("Enter Numbers only...");
                        return;
                      } else {
                        setUpdateReclButtVisible(false);
                        setReclaiming({
                          ...reclaiming,
                          ["cpp3coal" + item + "recl"]: newValue,
                        });
                      }
                    }}
                    editable={editReclaiming}
                  />
                  )*/
              ))}
              {["patha", "pathb"].map((item, index) => (
                <AppTextBox
                  key={index}
                  label={item}
                  labelcolor="#e9c46a"
                  value={reclaiming[item + "recl"].toString()}
                  onChangeText={(newValue) => {
                    if (newValue === "") {
                      setUpdateReclButtVisible(true);
                      setReclaiming({
                        ...reclaiming,
                        [item + "recl"]: "",
                      });
                      return;
                    }
                    if (!/^[0-9]*$/.test(newValue)) {
                      alert("Enter Numbers only...");
                      return;
                    } else {
                      setUpdateReclButtVisible(false);
                      setReclaiming({
                        ...reclaiming,
                        [item + "recl"]: newValue,
                      });
                    }
                  }}
                  editable={editReclaiming}
                />
              ))}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(5),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: wp(6) }}>Total CPP1 Reclaiming</Text>
                <Text style={{ fontSize: wp(7) }}>
                  {reclaimingData.total_reclaiming.toString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(5),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: wp(6) }}>Total CPP3 Reclaiming</Text>
                <Text style={{ fontSize: wp(7) }}>
                  {reclaimingData.cpp3total_reclaiming.toString()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchReclaiming}
                  value={editReclaiming}
                />
              </View>
              {editReclaiming && (
                <AppButton
                  buttonName="Update Reclaiming"
                  buttonColour={updateReclButtVisible ? "#C7B7A3" : "#fc5c65"}
                  disabled={updateReclButtVisible}
                  onPress={onUpdateReclaiming}
                />
              )}
            </>
          </FieldSet>

          <FieldSet label="Feeding Data">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Feeding
              </Text>

              {[
                "ct1",
                "ct2",
                "ct3",
                "stream1",
                "stream1A",
                "pathc",
                "auto",
                "nonauto",
              ].map((item, index) => (
                <AppTextBox
                  key={index}
                  label={item}
                  labelcolor={
                    item === "stream1" ||
                    item === "stream1A" ||
                    item === "pathc" ||
                    item === "auto" ||
                    item === "nonauto" ||
                    item === "New_Stream"
                      ? "#e9c46a"
                      : "orange"
                  }
                  value={feeding[item].toString()}
                  onChangeText={(newValue) => {
                    if (newValue === "") {
                      setUpdateFeedButtVisible(true);
                      setFeeding({ ...feeding, [item]: "" });
                      return;
                    }
                    if (!/^[0-9]*$/.test(newValue)) {
                      alert("Enter Numbers only...");
                      return;
                    } else {
                      setUpdateFeedButtVisible(false);
                      setFeeding({ ...feeding, [item]: newValue });
                    }
                  }}
                  editable={editFeeding}
                  maxLength={4}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(30),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: hp(3) }}>Total Feeding</Text>
                <Text style={{ fontSize: hp(4) }}>
                  {feedingData.total_feeding.toString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchFeeding}
                  value={editFeeding}
                />
              </View>
              {editFeeding && (
                <AppButton
                  buttonName="Update Feeding"
                  buttonColour={updateFeedButtVisible ? "#C7B7A3" : "#fc5c65"}
                  disabled={updateFeedButtVisible}
                  onPress={onUpdateFeeding}
                />
              )}
            </>
          </FieldSet>

          <FieldSet label="Running Hours">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Running Hours
              </Text>
              {["2", "3", "4"].map((item, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: hp(4),
                    gap: hp(2),
                  }}
                  key={index}
                >
                  <View
                    style={{
                      height: hp(6),
                      width: wp(24),
                      backgroundColor: "orange",
                      borderRadius: hp(2),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: hp(3), fontWeight: "bold" }}>
                      {"Strm-" + item}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: wp(55),
                      backgroundColor: "white",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 23,
                    }}
                  >
                    <AppDropdown
                      id={"str" + item + "hrs"}
                      items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                      selectedValue={runningHours[
                        "str" + item + "hrs"
                      ].toString()}
                      onValueChange={(newValue) => {
                        setRunningHours({
                          ...runningHours,
                          ["str" + item + "hrs"]: newValue,
                        });
                      }}
                      enabled={editRunningHours}
                    />
                    <Text style={{ fontWeight: "900" }}>:</Text>
                    <AppDropdown
                      id={"str" + item + "min"}
                      items={["", "00", "10", "20", "30", "40", "50"]}
                      selectedValue={runningHours[
                        "str" + item + "min"
                      ].toString()}
                      onValueChange={(newValue) => {
                        setRunningHours({
                          ...runningHours,
                          ["str" + item + "min"]: newValue,
                        });
                      }}
                      enabled={editRunningHours}
                    />
                  </View>
                </View>
              ))}
              {["50", "49", "126"].map((item, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: hp(4),
                    gap: hp(3),
                  }}
                  key={index}
                >
                  <View
                    style={{
                      height: hp(6),
                      width: wp(22),
                      backgroundColor: "#e9c46a",
                      borderRadius: hp(2),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: hp(3),
                        fontWeight: "bold",
                      }}
                    >
                      {"CC" + item}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: wp(55),
                      backgroundColor: "white",
                      flexDirection: "row",
                      alignItems: "center",
                      borderRadius: 23,
                    }}
                  >
                    <AppDropdown
                      id={"cc" + item + "hrs"}
                      items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                      selectedValue={runningHours[
                        "cc" + item + "hrs"
                      ].toString()}
                      onValueChange={(newValue) => {
                        setRunningHours({
                          ...runningHours,
                          ["cc" + item + "hrs"]: newValue,
                        });
                      }}
                      enabled={editRunningHours}
                    />
                    <Text style={{ fontWeight: "900" }}>:</Text>
                    <AppDropdown
                      id={"cc" + item + "min"}
                      items={["", "00", "10", "20", "30", "40", "50"]}
                      selectedValue={runningHours[
                        "cc" + item + "min"
                      ].toString()}
                      onValueChange={(newValue) => {
                        setRunningHours({
                          ...runningHours,
                          ["cc" + item + "min"]: newValue,
                        });
                      }}
                      enabled={editRunningHours}
                    />
                  </View>
                </View>
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchRunningHours}
                  value={editRunningHours}
                />
              </View>
              {editRunningHours && (
                <AppButton
                  buttonName="Update Running Hours"
                  buttonColour={
                    updateRunnHrsButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateRunnHrsButtVisible}
                  onPress={onUpdateRunningHours}
                />
              )}
            </>
          </FieldSet>

          <FieldSet label="Delays">
            <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Shift Delays
              </Text>
              {shiftDelays.map((value, index) => (
                <DelayMessageComponent
                  key={index}
                  slno={index + 1}
                  onDelete={() => handleDeleteDelay(index)}
                  xbuttoncolor={editShiftDelays ? "#fc5c65" : "#C7B7A3"}
                  disable={editShiftDelays}
                  items={
                    currentShift == "A"
                      ? ["", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
                      : currentShift == "B"
                      ? [
                          "",
                          "14",
                          "15",
                          "16",
                          "17",
                          "18",
                          "19",
                          "20",
                          "21",
                          "22",
                        ]
                      : ["", "22", "23", "24", "1", "2", "3", "4", "5", "6"]
                  }
                  selectedValueFromHr={
                    delayComponent["fromhr" + index.toString()]
                  }
                  onSelectFromHr={(value) => {
                    if (value === "") {
                      alert("Select From-time..");
                      return;
                    }
                    if (
                      parseInt(value) > parseInt(delayComponent["tohr" + index])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    if (
                      parseInt(value) ===
                        parseInt(delayComponent["tohr" + index]) &&
                      parseInt(delayComponent["frommin" + index]) >
                        parseInt(delayComponent["tomin" + index])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    setUpdateShiftDelayButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["fromhr" + index]: value,
                    });
                  }}
                  selectedValueFromMin={
                    delayComponent["frommin" + index.toString()]
                  }
                  onSelectFromMin={(value) => {
                    if (value === "") {
                      alert("Select From-time..");
                      return;
                    }
                    if (
                      parseInt(value) >
                        parseInt(delayComponent["tomin" + index]) &&
                      parseInt(delayComponent["fromhr" + index]) >=
                        parseInt(delayComponent["tohr" + index])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    setUpdateShiftDelayButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["frommin" + index]: value,
                    });
                  }}
                  selectedValueToHr={delayComponent["tohr" + index.toString()]}
                  onSelectToHr={(value) => {
                    if (value === "") {
                      alert("Select To-time..");
                      return;
                    }
                    if (
                      parseInt(value) <
                      parseInt(delayComponent["fromhr" + index])
                    ) {
                      alert("To time should not be less than From time..");
                      return;
                    }
                    if (
                      parseInt(value) ===
                        parseInt(delayComponent["fromhr" + index]) &&
                      parseInt(delayComponent["frommin" + index]) >
                        parseInt(delayComponent["tomin" + index])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    setUpdateShiftDelayButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["tohr" + index]: value,
                    });
                  }}
                  selectedValueToMin={
                    delayComponent["tomin" + index.toString()]
                  }
                  onSelectToMin={(value) => {
                    if (value === "") {
                      alert("Select To-time..");
                      return;
                    }
                    if (
                      parseInt(delayComponent["fromhr" + index]) ===
                        parseInt(delayComponent["tohr" + index]) &&
                      parseInt(value) <=
                        parseInt(delayComponent["frommin" + index])
                    ) {
                      alert("To time should not be less than From time..");
                      return;
                    }
                    setUpdateShiftDelayButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["tomin" + index]: value,
                    });
                  }}
                  onChangeDesc={(value) => {
                    if (value === "") {
                      alert("Enter reason for the delay..");
                      setUpdateShiftDelayButtonVisible(true);
                      setDelayComponent({
                        ...delayComponent,
                        ["desc" + index]: "",
                      });
                      return;
                    }
                    setUpdateShiftDelayButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["desc" + index]: value,
                    });
                  }}
                  descvalue={delayComponent["desc" + index.toString()]}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchShiftDelays}
                  value={editShiftDelays}
                />
              </View>

              {editShiftDelays && (
                <AppButton
                  buttonName="Update ShiftDelays"
                  buttonColour={
                    updateShiftDelayButtonVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateShiftDelayButtonVisible}
                  onPress={onUpdateShiftDelays}
                />
              )}
            </View>
          </FieldSet>
          <FieldSet label="Bins Coal Stocks">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                MB Top Stock
              </Text>
              {Array.from({ length: coalNameCount }, (_, index) => (
                <AppTextBox
                  label={coalNames["cn" + (index + 1)]}
                  labelcolor="orange"
                  key={index}
                  onChangeText={(value) => {
                    if (value === "") {
                      setUpdateMbtopStockButtVisible(true);
                      setMbtopCoalData({
                        ...mbtopCoalData,
                        ["coal" + (index + 1) + "stock"]: "",
                      });
                      return;
                    }

                    if (!/^[0-9]*$/.test(value)) {
                      alert("Enter Numbers only...");
                      setUpdateMbtopStockButtVisible(true);
                      return;
                    } else {
                      setMbtopCoalData({
                        ...mbtopCoalData,
                        ["coal" + (index + 1) + "stock"]: value,
                      });
                      setUpdateMbtopStockButtVisible(false);
                    }
                  }}
                  keyboardType="number-pad"
                  value={mbtopCoalData[
                    "coal" + (index + 1) + "stock"
                  ].toString()}
                  editable={editMbtopStock}
                  maxLength={4}
                />
              ))}

              {Array.from({ length: coalNameCount }, (_, index) => {
                const oldcoalname =
                  mbtopCoalData["oldcoal" + (index + 1) + "name"].toString();
                if (oldcoalname !== "")
                  return (
                    <AppTextBox
                      label={mbtopCoalData[
                        "oldcoal" + (index + 1) + "name"
                      ].toString()}
                      labelcolor="orange"
                      key={index}
                      onChangeText={(value) => {
                        if (value === "") {
                          setUpdateMbtopStockButtVisible(true);
                          setMbtopCoalData({
                            ...mbtopCoalData,
                            ["oldcoal" + (index + 1) + "stock"]: "",
                          });
                          return;
                        }

                        if (!/^[0-9]*$/.test(value)) {
                          alert("Enter Numbers only...");
                          setUpdateMbtopStockButtVisible(true);
                          return;
                        } else {
                          setMbtopCoalData({
                            ...mbtopCoalData,
                            ["oldcoal" + (index + 1) + "stock"]: value,
                          });
                          setUpdateMbtopStockButtVisible(false);
                        }
                      }}
                      keyboardType="number-pad"
                      value={mbtopCoalData[
                        "oldcoal" + (index + 1) + "stock"
                      ].toString()}
                      editable={editMbtopStock}
                      maxLength={4}
                    />
                  );
              })}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(15),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: hp(3) }}>CPP1 Total Stock</Text>
                <Text style={{ fontSize: hp(4) }}>
                  {mbTopStockData.total_stock.toString()}
                </Text>
              </View>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(2.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                  marginTop: hp(3),
                }}
              >
                CPP3 Stock
              </Text>
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderRadius: 25,
                    width: wp(30),
                    height: hp(6),
                    marginLeft: wp(5),
                    borderRadius: 20,
                    gap: wp(5),
                    marginBottom: wp(10),
                  }}
                >
                  <Picker
                    id={index}
                    style={{
                      width: wp(35),
                      borderWidth: wp(1),
                      backgroundColor: "white",
                    }}
                    mode="dropdown"
                    onValueChange={(value) => {
                      setMbtopCoalData({
                        ...mbtopCoalData,
                        ["cpp3coal" + item + "name"]: value,
                      });
                    }}
                    enabled={editMbtopStock}
                    selectedValue={mbtopCoalData["cpp3coal" + item + "name"]}
                  >
                    {["Coal", "GYC", "BWS", "MCC", "BROOKS"].map((coal) => (
                      <Picker.Item
                        key={coal}
                        label={coal.toString()}
                        value={coal}
                        style={{ fontSize: hp(2.5) }}
                      />
                    ))}
                  </Picker>
                  <TextInput
                    selectionColor={"black"}
                    style={{
                      height: hp(6),
                      width: wp(30),
                      paddingLeft: wp(2),
                      fontSize: hp(3),
                      fontFamily: "Roboto",
                      borderWidth: wp(0.3),
                      borderRadius: 10,
                      borderColor: "#0c0c0c",
                      backgroundColor: "white",
                    }}
                    keyboardType="number-pad"
                    placeholder="Tons"
                    value={mbtopCoalData[
                      "cpp3coal" + item + "stock"
                    ].toString()}
                    onChangeText={(value) => {
                      if (!/^[0-9]*$/.test(value)) {
                        alert("Enter Numbers only...");
                        return;
                      } else {
                        setMbtopCoalData({
                          ...mbtopCoalData,
                          ["cpp3coal" + item + "stock"]: value,
                        });
                      }
                    }}
                    selectedValue={mbtopCoalData["cpp3coal" + item + "stock"]}
                    editable={editMbtopStock}
                  />
                </View>
              ))}
              {/*{[1, 2, 3, 4, 5, 6].map((item, index) =>
                mbtopCoalData["cpp3coal" + (index + 1) + "name"] === null ||
                mbtopCoalData["cpp3coal" + (index + 1) + "stock"] ===
                  0 ? null : (
                  <AppTextBox
                    key={index}
                    label={mbtopCoalData["cpp3coal" + (index + 1) + "name"]}
                    labelcolor="orange"
                    value={mbtopCoalData[
                      "cpp3coal" + (index + 1) + "stock"
                    ].toString()}
                    onChangeText={(newValue) => {
                      if (newValue === "") {
                        setUpdateMbtopStockButtVisible(true);
                        setMbtopCoalData({
                          ...mbtopCoalData,
                          ["cpp3coal" + (index + 1) + "stock"]: "",
                        });
                        return;
                      }
                      if (!/^[0-9]*$/.test(newValue)) {
                        alert("Enter Numbers only...");
                        setUpdateMbtopStockButtVisible(true);
                        return;
                      } else {
                        setMbtopCoalData({
                          ...mbtopCoalData,
                          ["cpp3coal" + (index + 1) + "stock"]: newValue,
                        });
                        setUpdateMbtopStockButtVisible(false);
                      }
                    }}
                    keyboardType="number-pad"
                    editable={editMbtopStock}
                    maxLength={4}
                  />
                )
                  )}*/}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(15),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: hp(3) }}>CPP3 Total Stock</Text>
                <Text style={{ fontSize: hp(4) }}>
                  {mbTopStockData.cpp3total_stock.toString()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchMbtopStock}
                  value={editMbtopStock}
                />
              </View>
              {editMbtopStock && (
                <AppButton
                  buttonName="Update MB-Top Stock"
                  buttonColour={
                    updateMbtopStockButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateMbtopStockButtVisible}
                  onPress={onUpdateMbtopStock}
                />
              )}
            </>
          </FieldSet>
          <FieldSet label="Coal-Tower Stock">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Coal Tower Stock
              </Text>
              {["ct1stock", "ct2stock", "ct3stock"].map((item, index) => (
                <AppTextBox
                  key={index}
                  label={item.split("s")[0]}
                  labelcolor="orange"
                  value={coalTowerStock[item].toString()}
                  onChangeText={(newValue) => {
                    if (newValue === "") {
                      setUpdateCoalTowerStockButtVisible(true);
                      setCoalTowerStock({ ...coalTowerStock, [item]: "" });
                      return;
                    }

                    if (!/^[0-9]*$/.test(newValue)) {
                      alert("Enter Numbers only...");
                      return;
                    } else {
                      setUpdateCoalTowerStockButtVisible(false);
                      setCoalTowerStock({
                        ...coalTowerStock,
                        [item]: newValue,
                      });
                    }
                  }}
                  editable={editCoalTowerStock}
                  maxLength={4}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(20),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: hp(3) }}>Total CT Stock</Text>
                <Text style={{ fontSize: hp(4) }}>
                  {coalTowerStockData.total_stock.toString()}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchCoalTowerStock}
                  value={editCoalTowerStock}
                />
              </View>
              {editCoalTowerStock && (
                <AppButton
                  buttonName="Update Coal-Tower Stock"
                  buttonColour={
                    updateCoalTowerStockButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateCoalTowerStockButtVisible}
                  onPress={onUpdateCoalTowerStock}
                />
              )}
            </>
          </FieldSet>
          <FieldSet label="coalAnalysis">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Coal Analysis
              </Text>
              {["ci", "ash", "vm", "fc", "tm"].map((item, index) => (
                <AppTextBox
                  key={index}
                  label={item}
                  labelcolor="orange"
                  tbSize="30%"
                  lbSize="30%"
                  onChangeText={(value) => {
                    if (value === "") {
                      setCoalAnalysis({ ...coalAnalysis, [item]: "" });
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    if (item === "ci" && value > 80) {
                      setCoalAnalysis({ ...coalAnalysis, [item]: value });
                      alert("Crushing Index not more than 80%..");
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    if (item === "ash" && value > 12) {
                      setCoalAnalysis({ ...coalAnalysis, [item]: value });
                      alert("Ash Index not more than 12..");
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    if (item === "vm" && value > 30) {
                      setCoalAnalysis({ ...coalAnalysis, [item]: value });
                      alert("VM not more than 30..");
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    if (item === "fc" && value > 70) {
                      setCoalAnalysis({ ...coalAnalysis, [item]: value });
                      alert("FC not more than 70..");
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    if (item === "tm" && value > 12) {
                      setCoalAnalysis({ ...coalAnalysis, [item]: value });
                      alert("TM not more than 12..");
                      setUpdateCoalAnalysisButtVisible(true);
                      return;
                    }
                    setCoalAnalysis({ ...coalAnalysis, [item]: value });
                    setUpdateCoalAnalysisButtVisible(false);
                  }}
                  value={coalAnalysis[item]}
                  editable={editCoalAnalysis}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchCoalAnalysis}
                  value={editCoalAnalysis}
                />
              </View>
              {editCoalAnalysis && (
                <AppButton
                  buttonName="Update Coal-Analysis"
                  buttonColour={
                    updateCoalAnalysisButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateCoalAnalysisButtVisible}
                  onPress={onUpdateCoalAnalysis}
                />
              )}
            </>
          </FieldSet>
          <FieldSet label="PushingSchedule">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Pushing Schedule
              </Text>
              {[1, 2, 3, 4, 5].map((batt, index) => (
                <AppTextBox
                  key={index}
                  label={"Batt-" + batt}
                  labelcolor="orange"
                  tbSize="20%"
                  onChangeText={(value) => {
                    if (value === "") {
                      setPushingSchedule({
                        ...pushingSchedule,
                        ["bat" + batt]: "",
                      });
                      setUpdatePushingScheduleButtVisible(true);
                      return;
                    }
                    setPushingSchedule({
                      ...pushingSchedule,
                      ["bat" + batt]: value,
                    });
                    setUpdatePushingScheduleButtVisible(false);
                  }}
                  value={pushingSchedule["bat" + batt].toString()}
                  maxLength={2}
                  editable={editPushingSchedule}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: wp(20),
                  marginTop: wp(10),
                  marginBottom: wp(10),
                }}
              >
                <Text style={{ fontSize: hp(3) }}>Total Pushings</Text>
                <Text style={{ fontSize: hp(4) }}>
                  {pushingScheduleData.total_pushings.toString()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchPushingSchedule}
                  value={editPushingSchedule}
                />
              </View>
              {editPushingSchedule && (
                <AppButton
                  buttonName="Update Pushing-Schedule"
                  buttonColour={
                    updatePushingScheduleButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updatePushingScheduleButtVisible}
                  onPress={onUpdatePushingSchedule}
                />
              )}
            </>
          </FieldSet>

          <FieldSet label="Crusher Status">
            <>
              <Text
                style={{
                  alignSelf: "center",
                  borderBottomWidth: 2,
                  fontSize: hp(3.5),
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: hp(3),
                }}
              >
                Crusher Status
              </Text>
              {[34, 35, 36, 37, 38].map((num, index) => (
                <CrusherEdit
                  key={index}
                  labelcolor="orange"
                  label={num}
                  onChangeStatus={(value) => {
                    if (value === "") {
                      alert("select cr-" + num + " status..");
                      setUpdateCrusherStatusButtVisible(true);
                      return;
                    }
                    setCrusherStatus({
                      ...crusherStatus,
                      ["cr" + num + "status"]: value,
                    });
                    setUpdateCrusherStatusButtVisible(false);
                  }}
                  onChangeFeeder={(value) => {
                    if (value === "") {
                      alert("select cr-" + num + " feeder..");
                      setUpdateCrusherStatusButtVisible(true);
                      return;
                    }
                    setCrusherStatus({
                      ...crusherStatus,
                      ["cr" + num + "feeder"]: value,
                    });
                    setUpdateCrusherStatusButtVisible(false);
                  }}
                  selectedStatus={crusherStatus["cr" + num + "status"]}
                  selectedFeeder={crusherStatus["cr" + num + "feeder"]}
                  editable={editCrusherStatus}
                />
              ))}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: hp(4) }}>Edit</Text>
                <Switch
                  onValueChange={toggleSwitchCrusherStatus}
                  value={editCrusherStatus}
                />
              </View>
              {editCrusherStatus && (
                <AppButton
                  buttonName="Update Crusher-Status"
                  buttonColour={
                    updateCrusherStatusButtVisible ? "#C7B7A3" : "#fc5c65"
                  }
                  disabled={updateCrusherStatusButtVisible}
                  onPress={onUpdateCrusherStatus}
                />
              )}
            </>
          </FieldSet>

          <AppButton
            buttonName="Back"
            buttonColour="#fc5c65"
            onPress={handleBackButton}
          />
        </ScrollView>
      </View>
    </>
  );
}
