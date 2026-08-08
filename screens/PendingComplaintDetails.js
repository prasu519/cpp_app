import React, { useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import AppButton from "../components/AppButton";
import { FormatDate } from "../utils/FormatDate";
import Authentication from "./BlendAuthentication";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function PendingComplaintDetails({ navigation, route }) {
  const { complaint } = route.params;

  const [completed, setCompleted] = useState(false);
  const [authModelVisible, setAuthModelVisible] = useState(false);
  var updatedBy;

  const handleAuthClose = () => {
    setAuthModelVisible(false);
  };

  const handleMarkAsCompleted = () => {
    setCompleted(true);
    setAuthModelVisible(true);
  };

  const handleAuthModelSubmit = async (empnum) => {
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          updatedBy = responce.data.data[0].name;
          if (
            complaint.complaintType == "hk" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Dharma Rao" ||
              responce.data.data[0].name == "US Reddy")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "oper" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Dharma Rao" ||
              responce.data.data[0].name == "US Reddy")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "mech" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Anurag")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "elec" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Suryanarayana")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "inst" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Babji")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "other" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep")
          ) {
            updateComplaint();
          } else alert("No permission to change..");
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
  };

  const updateComplaint = async () => {
    try {
      await axios.put(`${BaseUrl}/complaints/${complaint._id}`, {
        status: "solved",
        updatedby: updatedBy,
      });

      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Pending Complaint Details</Text>

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

          <Text>Mark as Completed</Text>
        </View>

        <AppButton
          buttonName="OK"
          buttonColour="#4CAF50"
          width="60%"
          onPress={() => {
            if (completed) {
              //updateComplaint();
              handleMarkAsCompleted();
            } else {
              navigation.goBack();
            }
          }}
        />
        <Authentication
          onClose={handleAuthClose}
          visible={authModelVisible}
          onSubmit={handleAuthModelSubmit}
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
