import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text } from "@rneui/base";
import { FlatList, TouchableOpacity } from "react-native";
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

export default function DeleteComplaintList({ navigation, route }) {
  const [streamList, setStreamList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [cleaningAreaList, setCleaningAreaList] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedCleaningArea, setSelectedCleaningArea] = useState(null);
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const { credentials } = useContext(GlobalContext);
  const { type } = route.params;

  const displayDate = new Date();

  const blendDate = new Date().toISOString().split("T")[0];

  const currentShift = shift(new Date().getHours());

  useFocusEffect(
    useCallback(() => {
      getComplaintList();
    }, [])
  );

  useEffect(() => {
    getStreams();
  }, []);

  useEffect(() => {
    getComplaintList();
  }, []);

  const getStreams = async () => {
    try {
      const response = await axios.get(BaseUrl + "/streams");
      setStreamList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getComplaintList = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/complaintlist/${type}`);
      setComplaints(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getEquipments = async (streamId) => {
    try {
      const response = await axios.get(`${BaseUrl}/equipments/${streamId}`);
      setEquipmentList(response.data);
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

    if (!selectedCleaningArea) {
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
        area: selectedCleaningArea,
        description: description,
        status: "Pending",
      };

      const response = await axios.post(BaseUrl + "/complaints", body);

      alert("Complaint Added Successfully");

      // Clear form
      setSelectedStream(null);
      setSelectedEquipment(null);
      setSelectedCleaningArea(null);

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
            height: hp(7),
          }}
        >
          <Text
            style={{
              fontSize: hp(4),
              marginTop: hp(1),
            }}
          >
            Delete Complaint List
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
      <View
        style={{
          flex: 1,
          marginTop: hp(28),
          paddingHorizontal: 15,
        }}
      >
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#F7FCFF",
                borderRadius: 15,
                padding: 18,
                marginBottom: 15,

                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 4,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },

                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#1565C0",
                }}
              >
                {FormatDate(new Date(item.date))}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 17,
                }}
              >
                Equipment : {item.equipment}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 17,
                }}
              >
                Area : {item.area}
              </Text>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      item.status == "pending" ? "#FFE082" : "#A1CB35",
                    borderRadius: 20,
                    paddingHorizontal: 15,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    style={{
                      color: item.status == "pending" ? "#6D4C41" : "white",
                      fontWeight: "bold",
                    }}
                  >
                    {item.status}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#2196F3",
                    borderRadius: 8,
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                  }}
                  onPress={() => {
                    navigation.navigate("DeleteComplaintDetails", {
                      complaint: item,
                    });
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
