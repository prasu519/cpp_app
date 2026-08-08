import React, { useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import AppButton from "../components/AppButton";
import { FormatDate } from "../utils/FormatDate";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function DeleteComplaintDetails({ navigation, route }) {
  const { complaint } = route.params;

  const [completed, setCompleted] = useState(false);

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Complaint",
      "Are you sure you want to delete this complaint?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteComplaint(),
        },
      ]
    );
  };

  const deleteComplaint = async () => {
    try {
      await axios.delete(`${BaseUrl}/complaints/${complaint._id}`);
      alert("Complaint deleted successfully");
      navigation.goBack();
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Unable to delete complaint");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Delete Complaint Details</Text>

        <Text>Date : {FormatDate(new Date(complaint.date))}</Text>

        <Text>Shift : {complaint.shift}</Text>

        <Text>Emp No : {complaint.empNo}</Text>

        <Text>Name : {complaint.name}</Text>

        <Text>Stream : {complaint.stream}</Text>

        <Text>
          Complaint Type :{" "}
          {complaint.complaintType == "hk"
            ? "Housekeeping"
            : complaint.complaintType == "oper"
            ? "Operational"
            : complaint.complaintType == "mech"
            ? "Mechanical"
            : complaint.complaintType == "elec"
            ? "Electrical"
            : complaint.complaintType == "inst"
            ? "Instrumentation"
            : complaint.complaintType == "other"
            ? "Others"
            : "NA"}
        </Text>

        <Text>Equipment : {complaint.equipment}</Text>

        <Text>Area : {complaint.area}</Text>

        <Text>Description :</Text>

        <Text
          style={{
            backgroundColor: "#F2F2F2",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {complaint.description}
        </Text>

        <Text>Status : {complaint.status}</Text>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            value={completed}
            onValueChange={setCompleted}
            color={completed ? "#2E7D32" : undefined}
            style={{
              width: 24,
              height: 24,
              marginRight: 10,
            }}
          />

          <Text>Delete Complaint</Text>
        </View>

        <AppButton
          buttonName="OK"
          buttonColour="#4CAF50"
          width="60%"
          onPress={() => {
            if (completed) {
              confirmDelete();
            } else {
              navigation.goBack();
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    marginTop: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
};
