import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import AppButton from "../components/AppButton";
import { FormatDate } from "../utils/FormatDate";
import Authentication from "./BlendAuthentication";
import ImageViewer from "react-native-image-zoom-viewer";
import { Audio } from "expo-av";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function PendingComplaintDetails({ navigation, route }) {
  const { complaint } = route.params;

  const [completed, setCompleted] = useState(false);
  const [authModelVisible, setAuthModelVisible] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  var updatedBy;

  const handleAuthClose = () => {
    setAuthModelVisible(false);
  };

  const handleMarkAsCompleted = () => {
    setCompleted(true);
    setAuthModelVisible(true);
  };

  const playComplaintVoice = async () => {
    try {
      if (!complaint.voice?.filename) {
        Alert.alert("Voice Recording", "No voice recording available.");
        return;
      }

      let currentSound = sound;

      // Load the recording only once
      if (!currentSound) {
        const voiceUrl = `${BaseUrl}/uploads/complaints/${complaint.voice.filename}`;

        const result = await Audio.Sound.createAsync(
          { uri: voiceUrl },
          { shouldPlay: false }
        );

        currentSound = result.sound;
        setSound(currentSound);

        currentSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
          } else if (status.error) {
            console.log("Audio status error:", status.error);
            setIsPlaying(false);
          }
        });
      }

      const status = await currentSound.getStatusAsync();

      if (!status.isLoaded) {
        console.log("Audio is not loaded");
        return;
      }

      // Pause currently playing audio
      if (status.isPlaying) {
        await currentSound.pauseAsync();
        return;
      }

      // Restart if the recording has reached its end
      const hasFinished =
        status.didJustFinish ||
        (status.durationMillis > 0 &&
          status.positionMillis >= status.durationMillis - 200);

      if (hasFinished) {
        await currentSound.stopAsync();
        await currentSound.setPositionAsync(0);
      }

      // Start or resume playback
      await currentSound.playAsync();
    } catch (error) {
      console.log("Complaint voice playback error:", error);
      setIsPlaying(false);
      Alert.alert("Playback Error", error.message || "Unable to play voice.");
    }
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
              responce.data.data[0].name == "Dharma Rao" ||
              responce.data.data[0].name == "Anurag")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "elec" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Dharma Rao" ||
              responce.data.data[0].name == "Suryanarayana")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "inst" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Sandeep" ||
              responce.data.data[0].name == "Dharma Rao" ||
              responce.data.data[0].name == "Babji")
          ) {
            updateComplaint();
          } else if (
            complaint.complaintType == "other" &&
            (responce.data.data[0].name == "Prasanna" ||
              responce.data.data[0].name == "Phaneendra" ||
              responce.data.data[0].name == "Dharma Rao" ||
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

        {/* Complaint Image */}

        <View style={styles.imageSection}>
          <Text style={styles.imageTitle}>Complaint Image :</Text>
          {complaint.image?.filename ? (
            <TouchableOpacity onPress={() => setShowFullImage(true)}>
              <Image
                source={{
                  uri: `${BaseUrl}/uploads/complaints/${complaint.image.filename}`,
                }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <Text>No image filename found in complaint data.</Text>
          )}
        </View>

        {/* Complaint Voice */}
        <View style={styles.voiceSection}>
          <Text style={styles.imageTitle}>Complaint Voice :</Text>

          {complaint.voice?.filename ? (
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={playComplaintVoice}
            >
              <Text style={styles.voiceButtonText}>
                {isPlaying ? "⏸ Pause Voice" : "▶ Play Voice"}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text>No voice recording available.</Text>
          )}
        </View>

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

        {/* FULL IMAGE MODAL WITH ZOOM */}
        <Modal
          visible={showFullImage}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <View style={styles.fullImageContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFullImage(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {complaint.image?.filename ? (
              <ImageViewer
                imageUrls={[
                  {
                    url: `${BaseUrl}/uploads/complaints/${complaint.image.filename}`,
                  },
                ]}
                enableSwipeDown={true}
                onSwipeDown={() => setShowFullImage(false)}
                renderIndicator={() => null}
                backgroundColor="rgba(0,0,0,0.95)"
                saveToLocalByLongPress={false}
              />
            ) : null}
          </View>
        </Modal>
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

  // Small image section
  imageSection: {
    marginTop: 15,
    marginBottom: 15,
  },

  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  thumbnail: {
    width: wp("35%"),
    height: hp("20%"),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
  },

  // Full screen image
  fullImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
  },

  fullImage: {
    width: "100%",
    height: "85%",
  },

  // X button at top-left
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  closeButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },

  voiceSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  voiceButton: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  voiceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};
