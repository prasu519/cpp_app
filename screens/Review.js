import {
  View,
  Text,
  ScrollView,
  Switch,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";
import axios from "axios";
import AppButton from "../components/AppButton";
import BaseUrl from "../config/BaseUrl";

export default function Review({ navigation }) {
  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();

  const [editFeeding, setEditFeeding] = useState(false);
  const [editReclaiming, setEditReclaiming] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updateFeedButtVisible, setUpdateFeedButtVisible] = useState(false);
  const [updateReclButtVisible, setUpdateReclButtVisible] = useState(false);
  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    getfeedingdata();
    getReclaimingData();
  }, []);

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
    setIsLoaded(true);
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

    setIsLoaded(true);
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

    const coaltotal =
      parseInt(reclaiming.coal1recl) +
      parseInt(reclaiming.coal2recl) +
      parseInt(reclaiming.coal3recl) +
      parseInt(reclaiming.coal4recl) +
      parseInt(reclaiming.coal5recl) +
      parseInt(reclaiming.coal6recl) +
      parseInt(reclaiming.coal7recl) +
      parseInt(reclaiming.coal8recl);

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
  };

  if (!isLoaded || feeding == undefined || reclaiming == undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No Data Available..</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const toggleSwitchFeeding = () => {
    setEditFeeding((previousState) => !previousState);
  };
  const toggleSwitchReclaiming = () => {
    setEditReclaiming((previousState) => !previousState);
  };

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

        <AppButton
          buttonName="Back"
          buttonColour="#fc5c65"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}
