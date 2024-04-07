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
  };

  const onUpdateReclaiming = async () => {
    const streamtotal =
      parseInt(reclaiming.cc49) +
      parseInt(reclaiming.cc50) +
      parseInt(reclaiming.cc126);

    const coaltotal =
      parseInt(reclaiming.coal1) +
      parseInt(reclaiming.coal2) +
      parseInt(reclaiming.coal3) +
      parseInt(reclaiming.coal4) +
      parseInt(reclaiming.coal5);

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
            <AppTextBox
              label="CT-1"
              labelcolor="#6a994e"
              value={feeding.ct1.toString()}
              onChangeText={(newValue) => {
                setFeeding({ ...feeding, ct1: newValue });
              }}
              editable={editFeeding}
            />
            <AppTextBox
              label="CT-2"
              labelcolor="#6a994e"
              value={feeding.ct2.toString()}
              onChangeText={(newValue) => {
                setFeeding({ ...feeding, ct2: newValue });
              }}
              editable={editFeeding}
            />
            <AppTextBox
              label="CT-3"
              labelcolor="#6a994e"
              value={feeding.ct3.toString()}
              onChangeText={(newValue) => {
                setFeeding({ ...feeding, ct3: newValue });
              }}
              editable={editFeeding}
            />
            <AppTextBox
              label="Stream-1"
              labelcolor="#e9c46a"
              value={feeding.stream1.toString()}
              onChangeText={(newValue) => {
                setFeeding({ ...feeding, stream1: newValue });
              }}
              editable={editFeeding}
            />
            <AppTextBox
              label="Stream-1A"
              labelcolor="#e9c46a"
              value={feeding.stream1A.toString()}
              onChangeText={(newValue) => {
                setFeeding({ ...feeding, stream1A: newValue });
              }}
              editable={editFeeding}
            />
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
              <TouchableOpacity
                style={{
                  backgroundColor: "#fc5c65",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 15,
                  marginTop: 30,
                  width: "90%",
                  marginVertical: 10,
                  alignSelf: "center",
                }}
                onPress={onUpdateFeeding}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Update Feeding
                </Text>
              </TouchableOpacity>
            )}
          </>
        </FieldSet>
        <FieldSet label="Reclaiming Data">
          <>
            <AppTextBox
              label="GYC"
              labelcolor="#6a994e"
              value={reclaiming.coal1.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, coal1: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="MCC"
              labelcolor="#6a994e"
              value={reclaiming.coal2.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, coal2: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="BROOKS"
              labelcolor="#6a994e"
              value={reclaiming.coal3.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, coal3: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="MSOFT"
              labelcolor="#6a994e"
              value={reclaiming.coal4.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, coal4: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="PCI"
              labelcolor="#6a994e"
              value={reclaiming.coal5.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, coal5: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="CC-49"
              labelcolor="#e9c46a"
              value={reclaiming.cc49.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, cc49: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="CC-50"
              labelcolor="#e9c46a"
              value={reclaiming.cc50.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, cc50: newValue });
              }}
              editable={editReclaiming}
            />
            <AppTextBox
              label="CC-126"
              labelcolor="#e9c46a"
              value={reclaiming.cc126.toString()}
              onChangeText={(newValue) => {
                setReclaiming({ ...reclaiming, cc126: newValue });
              }}
              editable={editReclaiming}
            />

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
              <TouchableOpacity
                style={{
                  backgroundColor: "#fc5c65",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 15,
                  marginTop: 30,
                  width: "90%",
                  marginVertical: 10,
                  alignSelf: "center",
                }}
                onPress={onUpdateReclaiming}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Update Reclaiming
                </Text>
              </TouchableOpacity>
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
