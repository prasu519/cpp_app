import {
  View,
  Text,
  ScrollView,
  Switch,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";
import axios from "axios";
import AppButton from "../components/AppButton";
import BaseUrl from "../config/BaseUrl";
import AppDropdown from "../components/AppDropdown";

export default function Review({ navigation }) {
  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();
  const [runningHours, setRunningHours] = useState();

  const [editFeeding, setEditFeeding] = useState(false);
  const [editReclaiming, setEditReclaiming] = useState(false);
  const [editRunningHours, setEditRunningHours] = useState(false);

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [reclaimingCount, setReclaimingCount] = useState(0);

  const [updateFeedButtVisible, setUpdateFeedButtVisible] = useState(false);
  const [updateReclButtVisible, setUpdateReclButtVisible] = useState(false);
  const [updateRunnHrsButtVisible, setUpdateRunnhrsHButtVisible] =
    useState(false);

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
      getTotalCoals();
    }
  }, []);

  useEffect(() => {
    if (runningHours == undefined) return;
    checkIsRunningHoursNull();
  }, [runningHours]);

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
        runningHours["str" + i + "hrs"] === "" ||
        runningHours["str" + i + "hrs"] === "" ||
        runningHours["str" + i + "min"] === "" ||
        runningHours["str" + i + "min"] === "" ||
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

  const toggleSwitchFeeding = () => {
    setEditFeeding((previousState) => !previousState);
  };
  const toggleSwitchReclaiming = () => {
    setEditReclaiming((previousState) => !previousState);
  };
  const toggleSwitchRunningHours = () => {
    setEditRunningHours((previousState) => !previousState);
  };

  if (
    isLoaded ||
    feeding == undefined ||
    reclaiming == undefined ||
    runningHours == undefined
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
      <ScrollView style={{ padding: 10 }}>
        <FieldSet label="Feeding Data">
          <>
            {["ct1", "ct2", "ct3", "stream1", "stream1A"].map((item, index) => (
              <AppTextBox
                key={index}
                label={item}
                labelcolor="#6a994e"
                value={feeding[item].toString()}
                onChangeText={(newValue) => {
                  if (newValue === "") {
                    alert("Enter " + item + " Feeding..");
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
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={editFeeding ? "f5dd4b" : "#f4f3f4"}
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
        <FieldSet label="Reclaiming Data">
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
              reclaiming["coal" + item + "name"] === null ? null : (
                <AppTextBox
                  key={index}
                  label={reclaiming["coal" + item + "name"]}
                  labelcolor="#6a994e"
                  value={reclaiming["coal" + item + "recl"]}
                  onChangeText={(newValue) => {
                    if (newValue === "") {
                      alert(
                        "Enter " +
                          reclaiming["coal" + item + "name"] +
                          " Reclaiming.."
                      );
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
                value={reclaiming[item + "recl"]}
                onChangeText={(newValue) => {
                  if (newValue === "") {
                    alert("Enter " + item + " Reclaiming..");
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
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={editReclaiming ? "f5dd4b" : "#f4f3f4"}
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

                      /* if (newValue === "") {
                        alert("Make sure to enter all values..");
                        setUpdateRunnhrsHButtVisible(true);
                        return;
                      } else checkIsRunningHoursNull();*/
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
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={editRunningHours ? "f5dd4b" : "#f4f3f4"}
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
        <FieldSet label="Delays"></FieldSet>

        <AppButton
          buttonName="Back"
          buttonColour="#fc5c65"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}
