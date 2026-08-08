import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Text } from "@rneui/base";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { FormatDate } from "../utils/FormatDate";
import AppButton from "../components/AppButton";
import { GlobalContext } from "../contextApi/GlobalContext";
import shift from "../utils/Shift";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function EnterComplaintDetails({ route }) {
  const [streamList, setStreamList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [cleaningAreaList, setCleaningAreaList] = useState([]);
  const [mechanicalAreaList, setMechanicalAreaList] = useState([]);
  const [electricalAreaList, setElectricalAreaList] = useState([]);
  const [instrumentalAreaList, setInstrumentalAreaList] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [description, setDescription] = useState("");
  const { credentials } = useContext(GlobalContext);
  const { type } = route.params;

  const displayDate = new Date();

  const blendDate = new Date().toISOString().split("T")[0];

  const currentShift = shift(new Date().getHours());

  useEffect(() => {
    getStreams();
  }, []);

  const getStreams = async () => {
    try {
      const response = await axios.get(BaseUrl + "/streams");
      setStreamList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getEquipments = async (streamId) => {
    try {
      const response = await axios.get(`${BaseUrl}/equipments/${streamId}`);

      const sortedEquipments = [...response.data].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

      if (type == "inst") {
        const requiredItems = [
          "WF",
          "Y8",
          "Y18",
          "Y19",
          "Y20",
          "Y21",
          "ODD BINS",
          "Y4",
          "EVEN BINS",
          "Y4A",
          "NEW BINS",
        ];

        const filteredItems = sortedEquipments.filter((item) =>
          requiredItems.includes(item.value)
        );
        setEquipmentList(filteredItems);
      } else setEquipmentList(sortedEquipments);
    } catch (err) {
      console.log(err);
    }
  };

  const getCleaningAreas = async (equipmentType) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/cleaningareas/${equipmentType}`
      );
      setCleaningAreaList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMechanicalAreas = async (equipmentType) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/mechanicalareas/${equipmentType}`
      );
      setMechanicalAreaList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getInstrumentalAreas = async (equipmentType) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/instrumentationareas/${equipmentType}`
      );
      setInstrumentalAreaList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getElectricalAreas = async (equipmentType) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/electricalareas/${equipmentType}`
      );
      setElectricalAreaList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitComplaint = async () => {
    // Validation
    if (!selectedStream) {
      alert("Please select Stream");
      return;
    }

    if (!selectedEquipment) {
      alert("Please select Equipment");
      return;
    }

    if (!selectedArea) {
      alert("Please select Area");
      return;
    }

    if (description.trim() === "") {
      alert("Please enter Description");
      return;
    }

    try {
      const body = {
        date: blendDate,
        shift: currentShift,
        empNo: credentials.empnum,
        name: credentials.name,
        complaintType: type,
        stream: selectedStream,
        equipment: selectedEquipment,
        area: selectedArea,
        description: description,
        status: "pending",
      };

      const response = await axios.post(BaseUrl + "/complaints", body);

      alert("Complaint Added Successfully");

      // Clear form
      setSelectedStream(null);
      setSelectedEquipment(null);
      setSelectedArea(null);

      setEquipmentList([]);
      setCleaningAreaList([]);

      setDescription("");
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to save complaint.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          height: hp(25),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
          gap: hp(0.5),
        }}
      >
        <View
          style={{
            alignItems: "center",
            height: hp(6),
          }}
        >
          <Text
            style={{
              fontSize: hp(4),
              marginTop: hp(1),
            }}
          >
            Enter Complaint Details
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            height: hp(4),
            marginTop: hp(1),
          }}
        >
          <Text
            style={{
              fontSize: hp(2.5),
              fontWeight: "bold",
            }}
          >
            {type == "hk"
              ? "Housekeeping"
              : type == "oper"
              ? "Operational"
              : type == "mech"
              ? "Mechanical"
              : type == "elec"
              ? "Electrical"
              : type == "inst"
              ? "Instrumental"
              : "Others"}
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            width: wp(85),
            left: wp(8),
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: hp(1),
          }}
        >
          <Text style={{ fontSize: hp(2.2) }}>
            DATE : {FormatDate(displayDate)}
          </Text>
          <Text style={{ fontSize: hp(2.2) }}> SHIFT : {currentShift}</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            width: wp(85),
            left: wp(8),
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: hp(2),
          }}
        >
          <Text style={{ fontSize: hp(2.5) }}>{credentials.empnum}</Text>

          <Text style={{ fontSize: hp(2.5) }}>{credentials.name}</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: wp(55),
          padding: hp(2),
        }}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 250,
              height: 60,
              borderRadius: 10,
              backgroundColor: "#FFDF82",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25 }}>Select Stream</Text>
          </View>

          <Dropdown
            style={{
              width: 250,
              height: 55,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 15,
              paddingHorizontal: 15,
              backgroundColor: "white",
            }}
            data={streamList}
            labelField="label"
            valueField="value"
            placeholder="Choose Stream"
            value={selectedStream}
            onChange={(item) => {
              setSelectedStream(item.value);

              setSelectedEquipment(null);

              setSelectedArea(null);

              setEquipmentList([]);

              setCleaningAreaList([]);

              getEquipments(item.value);
            }}
          />

          <View
            style={{
              width: 250,
              height: 60,
              borderRadius: 10,
              backgroundColor: "#FFDF82",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ fontSize: 25 }}>Select Equipment</Text>
          </View>

          <Dropdown
            style={{
              width: 250,
              height: 55,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 15,
              paddingHorizontal: 15,
              backgroundColor: "white",
            }}
            data={equipmentList}
            labelField="label"
            valueField="value"
            placeholder="Choose Equipment"
            value={selectedEquipment}
            onChange={(item) => {
              setSelectedEquipment(item.value);

              setSelectedArea(null);

              if (type == "oper") getCleaningAreas(item.type);
              else if (type == "mech") getMechanicalAreas(item.type);
              else if (type == "elec") getElectricalAreas(item.type);
              else if (type == "inst") getInstrumentalAreas(item.type);
              // getElectricalAreas(item.type);
            }}
            mode="modal" // or "default"
            maxHeight={300}
          />
          <View
            style={{
              width: 250,
              height: 60,
              borderRadius: 10,
              backgroundColor: "#FFDF82",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ fontSize: 25 }}>Select Area</Text>
          </View>

          <Dropdown
            style={{
              width: 250,
              height: 55,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 15,
              paddingHorizontal: 15,
              backgroundColor: "white",
            }}
            data={
              type == "oper"
                ? cleaningAreaList
                : type == "mech"
                ? mechanicalAreaList
                : type == "elec"
                ? electricalAreaList
                : type == "inst"
                ? instrumentalAreaList
                : ""
            }
            labelField="label"
            valueField="value"
            placeholder="Choose Area"
            value={selectedArea}
            onChange={(item) => {
              setSelectedArea(item.value);
            }}
            mode="modal" // or "default"
            maxHeight={300}
          />
          <View
            style={{
              height: hp(20),
              width: wp(80),
              alignSelf: "center",
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: hp(6),
              alignItems: "center",
              justifyContent: "center",
              marginBottom: hp(3),
            }}
          >
            <TextInput
              style={{
                width: wp(80),
                height: hp(18),
                fontSize: 18,
                padding: 10,
                textAlignVertical: "top",
              }}
              multiline
              placeholder="Enter description..."
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <AppButton
            buttonName="Add Complaint"
            buttonColour="#FF9D4D"
            width="60%"
            onPress={submitComplaint}
          />
        </View>
      </ScrollView>
    </View>
  );
}
