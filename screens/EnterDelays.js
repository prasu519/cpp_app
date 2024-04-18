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

export default function EnterDelays({ navigation }) {
  const [newDelayComponent, setNewDelayComponent] = useState([""]);
  const [count, setCount] = useState(1);
  const [delays, setDelays] = useState([{}]);
  const [delayComponent, setDelayComponent] = useState({});
  const [buttonVisible, setButtonVisible] = useState(true);
  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [allEntrys, setAllEntrys] = useState(false);

  const initialiseDelayComponent = () => {
    delayComponent[`fromhr${count}`] = "";
    delayComponent[`frommin${count}`] = "";
    delayComponent[`tohr${count}`] = "";
    delayComponent[`tomin${count}`] = "";
    delayComponent[`desc${count}`] = "";
    delayComponent[`date`] = currentDate;
    delayComponent[`shift`] = currentShift;
  };

  useEffect(() => {
    initialiseDelayComponent();
  }, [count]);

  const handleNewDelayComponent = () => {
    setNewDelayComponent([...newDelayComponent, ""]);
    setCount(count + 1);
    setButtonVisible(true);
  };

  const handleDelete = (index) => {
    const updatedDelayComponents = newDelayComponent.filter(
      (_, i) => i !== index
    );
    setNewDelayComponent(updatedDelayComponents);
    setCount(count - 1);

    const tempObject = { ...delayComponent };

    delete tempObject["fromhr" + (index + 1)];
    delete tempObject["frommin" + (index + 1)];
    delete tempObject["tohr" + (index + 1)];
    delete tempObject["tomin" + (index + 1)];
    delete tempObject["desc" + (index + 1)];

    setDelayComponent(tempObject);

    if (count === 1) {
      setButtonVisible(false);
    }
  };

  const handleSubmit = async () => {
    if (count === 0) {
      alert("Add atleat one Delay..");
      return;
    }

    for (let i = 0; i < count; i++) {
      delays[i] = {
        date: currentDate,
        shift: currentShift,
        fromTime:
          delayComponent["fromhr" + (i + 1)] +
          ":" +
          delayComponent["frommin" + (i + 1)],
        toTime:
          delayComponent["tohr" + (i + 1)] +
          ":" +
          delayComponent["tomin" + (i + 1)],
        reason: delayComponent["desc" + (i + 1)],
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

  const currentDate =
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();

  const currentShift = shift(new Date().getHours());

  return (
    <>
      <DoneScreen
        progress={progress}
        onDone={() => setDoneScreen(false)}
        visible={doneScreen}
      />
      <View style={{ flex: 1, backgroundColor: "#FFCAD4", paddingBottom: 10 }}>
        <View
          style={{
            paddingTop: 40,
            paddingLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 80,
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
              fontSize: 25,
              textDecorationLine: "underline",
              color: "red",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Enter Delays
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
          <FieldSet>
            <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
              {newDelayComponent.map((value, index) => (
                <DelayMessageComponent
                  key={index}
                  slno={index + 1}
                  onDelete={() => handleDelete(index)}
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
                    delayComponent["fromhr" + (index + 1).toString()]
                  }
                  onSelectFromHr={(value) => {
                    if (value === "") {
                      setDelayComponent({
                        ...delayComponent,
                        ["fromhr" + (index + 1)]: value,
                      });

                      alert("Select From-time..");
                      setButtonVisible(true);
                      return;
                    }

                    if (
                      parseInt(value) >
                      parseInt(delayComponent["tohr" + (index + 1)])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["fromhr" + (index + 1)]: value,
                    });
                  }}
                  selectedValueFromMin={
                    delayComponent["frommin" + (index + 1).toString()]
                  }
                  onSelectFromMin={(value) => {
                    if (value === "") {
                      setDelayComponent({
                        ...delayComponent,
                        ["frommin" + (index + 1)]: value,
                      });

                      alert("Select From-time..");
                      setButtonVisible(true);
                      return;
                    }
                    if (
                      parseInt(value) >
                        parseInt(delayComponent["tomin" + (index + 1)]) &&
                      parseInt(delayComponent["fromhr" + (index + 1)]) >
                        parseInt(delayComponent["tohr" + (index + 1)])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["frommin" + (index + 1)]: value,
                    });
                  }}
                  selectedValueToHr={
                    delayComponent["tohr" + (index + 1).toString()]
                  }
                  onSelectToHr={(value) => {
                    if (value === "") {
                      setDelayComponent({
                        ...delayComponent,
                        ["tohr" + (index + 1)]: value,
                      });

                      alert("Select To-time..");
                      setButtonVisible(true);
                      return;
                    }

                    if (
                      parseInt(value) <
                      parseInt(delayComponent["fromhr" + (index + 1)])
                    ) {
                      alert("To time should not be less than From time..");
                      return;
                    }

                    if (
                      parseInt(delayComponent["frommin" + (index + 1)]) >
                      parseInt(delayComponent["tomin" + (index + 1)])
                    ) {
                      alert("From time should not be more than To time..");
                      return;
                    }
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["tohr" + (index + 1)]: value,
                    });
                  }}
                  selectedValueToMin={
                    delayComponent["tomin" + (index + 1).toString()]
                  }
                  onSelectToMin={(value) => {
                    if (value === "") {
                      setDelayComponent({
                        ...delayComponent,
                        ["tomin" + (index + 1)]: value,
                      });

                      alert("Select To-time..");
                      setButtonVisible(true);
                      return;
                    }
                    if (
                      parseInt(delayComponent["fromhr" + (index + 1)]) ===
                        parseInt(delayComponent["tohr" + (index + 1)]) &&
                      parseInt(value) <=
                        parseInt(delayComponent["frommin" + (index + 1)])
                    ) {
                      alert("To time should not be less than From time..");
                      return;
                    }
                    if (allEntrys) setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["tomin" + (index + 1)]: value,
                    });
                  }}
                  onChangeDesc={(value) => {
                    if (value === "") {
                      alert("Enter reason for the delay..");
                      setButtonVisible(true);
                      setDelayComponent({
                        ...delayComponent,
                        ["desc" + (index + 1)]: "",
                      });
                      return;
                    }

                    if (
                      value === "" ||
                      delayComponent["fromhr" + (index + 1).toString()] ===
                        "" ||
                      delayComponent["frommin" + (index + 1).toString()] ===
                        "" ||
                      delayComponent["tohr" + (index + 1).toString()] === "" ||
                      delayComponent["tomin" + (index + 1).toString()] === ""
                    ) {
                      setButtonVisible(true);
                      alert("Enter delay time first..");
                      return;
                    }
                    setButtonVisible(false);
                    setDelayComponent({
                      ...delayComponent,
                      ["desc" + (index + 1)]: value,
                    });
                    setAllEntrys(true);
                  }}
                  descvalue={delayComponent["desc" + (index + 1).toString()]}
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
