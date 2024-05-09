import {
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";
import axios from "axios";
import { Switch } from "@rneui/themed";
import AppButton from "../components/AppButton";
import BaseUrl from "../config/BaseUrl";
import AppDropdown from "../components/AppDropdown";
import DelayMessageComponent from "../components/DelayMessageComponent";

export default function Review({ navigation }) {
  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();
  const [runningHours, setRunningHours] = useState();
  const [shiftDelays, setShiftDelays] = useState([]);
  const [newshiftDelays, setNewShiftDelays] = useState([]);
  const [delayComponent, setDelayComponent] = useState({});
  const [coalNames, setCoalNames] = useState({});
  const [mbtopCoalData, setMbtopCoalData] = useState();
  const [coalTowerStock, setCoalTowerStock] = useState();
  const [coalAnalysisData, setCoalAnalysisData] = useState();
  const [pushingSchedule, setPushingSchedule] = useState();

  const [editFeeding, setEditFeeding] = useState(false);
  const [editReclaiming, setEditReclaiming] = useState(false);
  const [editRunningHours, setEditRunningHours] = useState(false);
  const [editShiftDelays, setEditShiftDelays] = useState(false);
  const [editMbtopStock, setEditMbtopStock] = useState(false);
  const [editCoalTowerStock, setEditCoalTowerStock] = useState(false);
  const [editCoalAnalysis, setEditCoalAnalysis] = useState(false);
  const [editPushingSchedule, setEditPushingSchedule] = useState(false);

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

  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    if (isLoaded) {
      getfeedingdata();
      getReclaimingData();
      getRunningHoursdata();
      getShiftDelayData();
      getTotalCoals();
      getCoalNames();
      getMbTopCoalData();
      getCoalTowerStock();
      getCoalAnalysisData();
      getPushingScheduleData();
    }
  }, []);

  useEffect(() => {
    if (runningHours == undefined) return;
    checkIsRunningHoursNull();
  }, [runningHours]);

  useEffect(() => {
    copyShiftDelayData();
  }, [shiftDelays]);

  const getTotalCoals = async () => {
    await axios
      .get(BaseUrl + "/blend")
      .then((response) => {
        setReclaimingCount(response.data.data.total);
      })
      .catch((error) => console.log(error));
  };

  const getfeedingdata = async () => {
    await axios
      .get(BaseUrl + "/feeding", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setFeeding(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getReclaimingData = async () => {
    await axios
      .get(BaseUrl + "/reclaiming", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setReclaiming(responce.data.data[0]))
      .catch((error) => console.log(error));

    setIsLoaded(false);
  };

  const getRunningHoursdata = async () => {
    await axios
      .get(BaseUrl + "/runningHours", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setRunningHours(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getShiftDelayData = async () => {
    await axios
      .get(BaseUrl + "/shiftDelay", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setShiftDelays(responce.data.data))
      .catch((error) => console.log(error));
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
      .get(BaseUrl + "/blend")
      .then((response) => {
        setCoalNames(response.data.data);
        setCoalNameCount(response.data.data.total);
      })
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getMbTopCoalData = async () => {
    await axios
      .get(BaseUrl + "/mbtopStock", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setMbtopCoalData(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getCoalTowerStock = async () => {
    await axios
      .get(BaseUrl + "/coaltowerstock", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setCoalTowerStock(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getCoalAnalysisData = async () => {
    await axios
      .get(BaseUrl + "/coalAnalysis", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setCoalAnalysisData(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const getPushingScheduleData = async () => {
    await axios
      .get(BaseUrl + "/pushings", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setPushingSchedule(responce.data.data[0]))
      .catch((error) => console.log(error));
    setIsLoaded(false);
  };

  const onUpdateFeeding = async () => {
    const totalFeeding =
      parseInt(feeding.ct1) + parseInt(feeding.ct2) + parseInt(feeding.ct3);
    const streamTotal = parseInt(feeding.stream1) + parseInt(feeding.stream1A);
    if (totalFeeding !== streamTotal) {
      alert("Coal Tower total and Stream total should be equal..");
      return;
    }
    const updatedFeeding = {
      ...feeding,
      total_feeding: totalFeeding,
    };
    await axios
      .put(BaseUrl + "/feeding", updatedFeeding)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));

    setEditFeeding(false);
  };

  const onUpdateReclaiming = async () => {
    const streamtotal =
      parseInt(reclaiming.cc49recl) +
      parseInt(reclaiming.cc50recl) +
      parseInt(reclaiming.cc126recl);
    let coaltotal = 0;
    for (let i = 1; i <= reclaimingCount; i++) {
      coaltotal = coaltotal + parseInt(reclaiming["coal" + i + "recl"]);
    }
    if (coaltotal !== streamtotal) {
      alert("CoalTotal and StreamTotal should be equal..");
      return;
    }
    const updatedReclaiming = {
      ...reclaiming,
      total_reclaiming: streamtotal,
    };
    await axios
      .put(BaseUrl + "/reclaiming", updatedReclaiming)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setEditReclaiming(false);
  };

  const onUpdateRunningHours = async () => {
    await axios
      .put(BaseUrl + "/runningHours", runningHours)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
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
    await axios
      .delete(BaseUrl + "/shiftDelay", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => console.log(responce.data))
      .catch((error) => console.log(error));
    for (let i = 0; i < count - 1; i++) {
      await axios
        .post(BaseUrl + "/shiftDelay", newshiftDelays[i])
        .then((response) => console.log(response.data))
        .catch((error) => {
          alert("Could not updated after delete delay-" + delaynumber);
        });
    }
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
        .then((response) => console.log(response.data))
        .catch((error) => {
          setDoneScreen(false);
          alert("Could not save data..");
        });
    }
    setEditShiftDelays(false);
  };

  const onUpdateMbtopStock = async () => {
    let totalMbtopStock = 0;
    for (let i = 0; i < coalNameCount; i++) {
      totalMbtopStock =
        totalMbtopStock + parseInt(mbtopCoalData["coal" + (i + 1) + "stock"]);
    }
    const newMbtopData = { ...mbtopCoalData, total_stock: totalMbtopStock };
    await axios
      .put(BaseUrl + "/mbtopStock", newMbtopData)
      .then((response) => console.log(response.data))
      .catch((error) => {
        setDoneScreen(false);
        alert("Could not update data..");
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
    await axios
      .put(BaseUrl + "/coaltowerstock", updatedCoalTowerStock)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));

    setEditCoalTowerStock(false);
  };

  const onUpdateCoalAnalysis = async () => {
    let totalofAVF =
      parseFloat(coalAnalysisData.ash) +
      parseFloat(coalAnalysisData.vm) +
      parseFloat(coalAnalysisData.fc);
    if (totalofAVF != 100) {
      alert("Total of Ash,Vm,Fc should be 100..");
      return;
    }
    await axios
      .put(BaseUrl + "/coalAnalysis", coalAnalysisData)
      .then((response) => console.log(response.data))
      .catch((error) => alert("Could not save data.."));
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
    console.log(newValues);
    await axios
      .put(BaseUrl + "/pushings", newValues)
      .then((response) => console.log(response.data))
      .catch((error) => {
        alert("Could not save data..");
      });
    setEditPushingSchedule(false);
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

  if (
    isLoaded ||
    feeding == undefined ||
    reclaiming == undefined
    // runningHours == undefined ||
    // shiftDelays == undefined ||
    //  mbtopCoalData == undefined ||
    // coalTowerStock == undefined ||
    // coalNames == undefined ||
    //  coalAnalysisData == undefined ||
    // pushingSchedule == undefined
  ) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F1F5A8" }}>
        <View
          style={{
            paddingTop: 40,
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 90,
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
              fontSize: 35,
              textDecorationLine: "underline",
              color: "red",
              fontWeight: "bold",
            }}
          >
            Review
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 80,
            paddingTop: 20,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 2,
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
            DATE :{currentDate}
          </Text>
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "red" }}>
            SHIFT :{currentShift}
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5A8" }}>
      <View
        style={{
          paddingTop: 40,
          paddingLeft: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 90,
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
            fontSize: 35,
            textDecorationLine: "underline",
            color: "#000080",
            fontWeight: "bold",
          }}
        >
          Review
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 80,
          paddingTop: 20,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}>
          DATE :{currentDate}
        </Text>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#000080" }}>
          SHIFT :{currentShift}
        </Text>
      </View>
      <ScrollView style={{ padding: 10 }}>
        <FieldSet label="Feeding Data">
          <>
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Feeding
            </Text>
            {["ct1", "ct2", "ct3", "stream1", "stream1A"].map((item, index) => (
              <AppTextBox
                key={index}
                label={item}
                labelcolor="#6a994e"
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
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 30 }}>Edit</Text>
              <Switch onValueChange={toggleSwitchFeeding} value={editFeeding} />
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

        <FieldSet label="Reclaiming Data">
          <>
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Reclaiming
            </Text>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
              reclaiming["coal" + item + "name"] === null ? null : (
                <AppTextBox
                  key={index}
                  label={reclaiming["coal" + item + "name"]}
                  labelcolor="#6a994e"
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 30 }}>Edit</Text>
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

        <FieldSet label="Running Hours">
          <>
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Running Hours
            </Text>
            {["2", "3", "4"].map((item, index) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",

                  padding: 20,
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {"Stream-" + item}
                </Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id={"str" + item + "hrs"}
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={runningHours["str" + item + "hrs"]}
                    onValueChange={(newValue) => {
                      setRunningHours({
                        ...runningHours,
                        ["str" + item + "hrs"]: newValue,
                      });
                      // checkIsRunningHoursNull(newValue, "str" + item + "hrs");
                    }}
                    enabled={editRunningHours}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id={"str" + item + "min"}
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={runningHours["str" + item + "min"]}
                    onValueChange={(newValue) => {
                      setRunningHours({
                        ...runningHours,
                        ["str" + item + "min"]: newValue,
                      });
                      // checkIsRunningHoursNull(newValue, "str" + item + "min");
                    }}
                    enabled={editRunningHours}
                  />
                </View>
              </View>
            ))}
            {["49", "50", "126"].map((item, index) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  justifyContent: "space-between",
                }}
                key={index}
              >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {"CC-" + item}
                </Text>
                <View
                  style={{
                    width: 210,
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 23,
                    gap: 1,
                  }}
                >
                  <AppDropdown
                    id={"cc" + item + "hrs"}
                    items={["", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                    selectedValue={runningHours["cc" + item + "hrs"]}
                    onValueChange={(newValue) => {
                      setRunningHours({
                        ...runningHours,
                        ["cc" + item + "hrs"]: newValue,
                      });
                      // checkIsRunningHoursNull();
                    }}
                    enabled={editRunningHours}
                  />
                  <Text style={{ fontWeight: "900" }}>:</Text>
                  <AppDropdown
                    id={"cc" + item + "min"}
                    items={["", "00", "10", "20", "30", "40", "50"]}
                    selectedValue={runningHours["cc" + item + "min"]}
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
              <Text style={{ fontSize: 30 }}>Edit</Text>
              <Switch
                onValueChange={toggleSwitchRunningHours}
                value={editRunningHours}
              />
            </View>
            {editRunningHours && (
              <AppButton
                buttonName="Update Running Hours"
                buttonColour={updateRunnHrsButtVisible ? "#C7B7A3" : "#fc5c65"}
                disabled={updateRunnHrsButtVisible}
                onPress={onUpdateRunningHours}
              />
            )}
          </>
        </FieldSet>

        <FieldSet label="Delays">
          <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Delays
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
                    ? ["", "14", "15", "16", "17", "18", "19", "20", "21", "22"]
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
                    parseInt(value) < parseInt(delayComponent["fromhr" + index])
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
                selectedValueToMin={delayComponent["tomin" + index.toString()]}
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
              <Text style={{ fontSize: 30 }}>Edit</Text>
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
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Mb-Top Stock
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
                value={mbtopCoalData["coal" + (index + 1) + "stock"]}
                editable={editMbtopStock}
                maxLength={4}
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
              <Text style={{ fontSize: 30 }}>Edit</Text>
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
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Coal-Tower Stock
            </Text>
            {["ct1stock", "ct2stock", "ct3stock"].map((item, index) => (
              <AppTextBox
                key={index}
                label={item}
                labelcolor="#6a994e"
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
                    setCoalTowerStock({ ...coalTowerStock, [item]: newValue });
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
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 30 }}>Edit</Text>
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
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Coal Analysis
            </Text>
            {["ci", "ash", "vm", "fc", "tm"].map((item, index) => (
              <AppTextBox
                key={index}
                label={item}
                labelcolor="#6a994e"
                tbSize="30%"
                lbSize="30%"
                onChangeText={(value) => {
                  if (value === "") {
                    setCoalAnalysisData({ ...coalAnalysisData, [item]: "" });
                    setUpdateCoalAnalysisButtVisible(true);
                    return;
                  }
                  setCoalAnalysisData({ ...coalAnalysisData, [item]: value });
                  setUpdateCoalAnalysisButtVisible(false);
                }}
                value={coalAnalysisData[item]}
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
              <Text style={{ fontSize: 30 }}>Edit</Text>
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
            <Text h3 h3Style={{ color: "red", alignSelf: "center" }}>
              Pushing Schedule
            </Text>
            {[1, 2, 3, 4, 5].map((batt, index) => (
              <AppTextBox
                key={index}
                label={"Batt-" + batt}
                labelcolor="#6a994e"
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
                value={pushingSchedule["bat" + batt]}
                maxLength={2}
                editable={editPushingSchedule}
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
              <Text style={{ fontSize: 30 }}>Edit</Text>
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
        <AppButton
          buttonName="Back"
          buttonColour="#fc5c65"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}
