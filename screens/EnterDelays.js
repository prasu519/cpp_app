import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import shift from "../utils/Shift";
import DelayMessageComponent from "../components/DelayMessageComponent";
import AppButton from "../components/AppButton";
import FieldSet from "react-native-fieldset";
import axios from "axios";
import BaseUrl from "../config/BaseUrl";
import DoneScreen from "./DoneScreen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function EnterDelays({ navigation }) {
  const [newDelayComponent, setNewDelayComponent] = useState([""]);
  const [count, setCount] = useState(1);
  const [delays, setDelays] = useState([{}]);
  const [delayComponent, setDelayComponent] = useState({});
  const [buttonVisible, setButtonVisible] = useState(true);
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allEntrys, setAllEntrys] = useState(false);
  const [oldDelays, setOldDelays] = useState([]);

  useEffect(() => {
    getShiftDelayData();
  }, []);

  const handleNewDelayComponent = () => {
    setNewDelayComponent([...newDelayComponent, ""]);
    setCount(count + 1);
    setButtonVisible(true);
  };

  const handleDelete = (index) => {
    const updatedDelayComponents = newDelayComponent.filter(
      (_, i) => i != index
    );
    setNewDelayComponent(updatedDelayComponents);
    setCount(count - 1);
    const tempObject = { ...delayComponent };
    delete tempObject["fromhr" + index];
    delete tempObject["frommin" + index];
    delete tempObject["tohr" + index];
    delete tempObject["tomin" + index];
    delete tempObject["desc" + index];
    setDelayComponent(tempObject);
    if (count === 1) {
      setButtonVisible(false);
    }
  };

  const getShiftDelayData = async () => {
    await axios
      .get(BaseUrl + "/shiftDelay", {
        params: {
          date: currentDate,
          shift: currentShift,
        },
      })
      .then((responce) => setOldDelays(responce.data.data))
      .catch((error) => console.log(error));
  };

  const handleSubmit = async () => {
    if (count === 0) {
      alert("Add atleat one Delay..");
      return;
    }
    const totOldDelays = oldDelays.length;
    let nextDelayNo = 1;
    if (totOldDelays != 0) nextDelayNo = totOldDelays + 1;
    for (i = 0; i < count; i++) {
      delays[i] = {
        date: currentDate,
        shift: currentShift,
        delayNumber: nextDelayNo + i,
        fromTime:
          delayComponent["fromhr" + i] + ":" + delayComponent["frommin" + i],
        toTime: delayComponent["tohr" + i] + ":" + delayComponent["tomin" + i],
        reason: delayComponent["desc" + i],
      };
    }
    setProgress(0);
    setDoneScreen(true);
    for (let i = 0; i < count; i++) {
      await axios
        .post(BaseUrl + "/shiftDelay", delays[i], {
          onUploadProgress: (progress) =>
            setProgress(progress.loaded / progress.total),
        })
        .then((response) => console.log(response.data))
        .catch((error) => {
          setDoneScreen(false);
          alert("Could not save data..");
        });
    }
    setDelayComponent({});
    setNewDelayComponent([""]);
    setButtonVisible(true);
  };

  const currentDate = new Date().toISOString().split("T")[0];

  /* const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();*/

  const currentShift = shift(new Date().getHours());

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
            height: hp(20),
            width: wp(100),
            backgroundColor: "#2FF3E0",
            borderBottomLeftRadius: hp(4),
            borderBottomRightRadius: hp(4),
          }}
        >
          <View
            style={{
              paddingTop: hp(5),
              paddingLeft: hp(2),
              flexDirection: "row",
              alignItems: "center",
              gap: wp(12),
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
              Enter Shift delays
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
          <FieldSet>
            <View style={{ flex: 1, alignItems: "center", gap: hp(2) }}>
              {newDelayComponent.map((value, index) => (
                <DelayMessageComponent
                  key={index}
                  slno={index + 1}
                  onDelete={() => handleDelete(index)}
                  disable={true}
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
                      setDelayComponent({
                        ...delayComponent,
                        ["fromhr" + index]: value,
                      });

                      alert("Select From-time..");
                      setButtonVisible(true);
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
                    if (allEntrys) setButtonVisible(false);
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
                      setDelayComponent({
                        ...delayComponent,
                        ["frommin" + index]: value,
                      });
                      alert("Select From-time..");
                      setButtonVisible(true);
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
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["frommin" + index]: value,
                    });
                  }}
                  selectedValueToHr={delayComponent["tohr" + index.toString()]}
                  onSelectToHr={(value) => {
                    if (value === "") {
                      setDelayComponent({
                        ...delayComponent,
                        ["tohr" + index]: value,
                      });

                      alert("Select To-time..");
                      setButtonVisible(true);
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
                    if (allEntrys) setButtonVisible(false);
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
                      setDelayComponent({
                        ...delayComponent,
                        ["tomin" + index]: value,
                      });
                      alert("Select To-time..");
                      setButtonVisible(true);
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
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["tomin" + index]: value,
                    });
                  }}
                  onChangeDesc={(value) => {
                    if (value === "") {
                      alert("Enter reason for the delay..");
                      setButtonVisible(true);
                      setDelayComponent({
                        ...delayComponent,
                        ["desc" + index]: "",
                      });
                      return;
                    }
                    if (
                      value === "" ||
                      delayComponent["fromhr" + index.toString()] === "" ||
                      delayComponent["frommin" + index.toString()] === "" ||
                      delayComponent["tohr" + index.toString()] === "" ||
                      delayComponent["tomin" + index.toString()] === ""
                    ) {
                      setButtonVisible(true);
                      alert("Enter delay time first..");
                      return;
                    }
                    setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["desc" + index]: value,
                    });
                    setAllEntrys(true);
                  }}
                  descvalue={delayComponent["desc" + index.toString()]}
                />
              ))}
              <AppButton
                buttonName="Add New Delay"
                buttonColour={buttonVisible ? "#C7B7A3" : "#87A922"}
                //buttonColour="#87A922"
                width="60%"
                disabled={buttonVisible}
                onPress={handleNewDelayComponent}
              />
            </View>
          </FieldSet>
          <AppButton
            buttonName="Submit"
            buttonColour={buttonVisible ? "#C7B7A3" : "#fc5c65"}
            //buttonColour="#fc5c65"
            disabled={buttonVisible}
            onPress={handleSubmit}
          />
        </ScrollView>
      </View>
    </>
  );
}
