import React, { useContext, useEffect, useState } from "react";
console.log();
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { Platform } from "react-native";

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
  const [photo, setPhoto] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const { credentials } = useContext(GlobalContext);
  const { type } = route.params;
  const [voice, setVoice] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const selectPhoto = () => {
    Alert.alert("Upload Photo", "Choose an option", [
      {
        text: "Camera",
        onPress: takePhoto,
      },
      {
        text: "Gallery",
        onPress: pickFromGallery,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        alert("Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const image = result.assets[0];

        setPhoto({
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          fileName: image.fileName || `complaint_${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      console.log("Camera error:", error);
      alert("Unable to take photo");
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const image = result.assets[0];

        // console.log("Selected image:", image);

        setPhoto({
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          fileName: image.fileName || `complaint_${Date.now()}.jpg`,
        });
      }
    } catch (error) {
      console.log("Gallery error:", error);
      alert("Unable to select photo");
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Microphone permission is required to record voice."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.log("Recording error:", error);
      Alert.alert("Error", "Unable to start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      setVoice({
        uri,
        name: `complaint_voice_${Date.now()}.m4a`,
        type: "audio/mp4",
      });

      setRecording(null);
      setIsRecording(false);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      Alert.alert("Success", "Voice recording saved.");
    } catch (error) {
      console.log("Stop recording error:", error);
      Alert.alert("Error", "Unable to save recording.");
      setIsRecording(false);
    }
  };

  const playVoice = async () => {
    try {
      if (!voice?.uri) return;

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: voice.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.log("Playback error:", error);
      Alert.alert("Error", "Unable to play recording.");
      setIsPlaying(false);
    }
  };

  const removeVoice = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      setVoice(null);
      setIsPlaying(false);
    } catch (error) {
      console.log("Remove voice error:", error);
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
      // Create FormData
      const formData = new FormData();

      // Add normal complaint data
      formData.append("date", blendDate);
      formData.append("shift", currentShift);
      formData.append("empNo", credentials.empnum);
      formData.append("name", credentials.name);
      formData.append("complaintType", type);
      formData.append("stream", selectedStream);
      formData.append("equipment", selectedEquipment);
      formData.append("area", selectedArea);
      formData.append("description", description.trim());
      formData.append("status", "pending");

      // Add photo
      if (photo) {
        formData.append("photo", {
          uri: photo.uri,
          type: photo.type || "image/jpeg",
          name: photo.fileName || `complaint_${Date.now()}.jpg`,
        });
      }

      // Add voice recording
      if (voice?.uri) {
        formData.append("voice", {
          uri: voice.uri,
          name: voice.name || `complaint_voice_${Date.now()}.m4a`,
          type: voice.type || "audio/mp4",
        });
      }

      // Send multipart/form-data
      const response = await axios.post(BaseUrl + "/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Complaint Added Successfully");

      // Clear form
      setSelectedStream(null);
      setSelectedEquipment(null);
      setSelectedArea(null);

      setEquipmentList([]);
      setCleaningAreaList([]);
      setMechanicalAreaList([]);
      setElectricalAreaList([]);
      setInstrumentalAreaList([]);

      setDescription("");
      setPhoto(null);
      setShowFullImage(false);
      setVoice(null);
      setIsRecording(false);
    } catch (err) {
      console.log("Upload Error:", err);
      console.log("Server Error:", err.response?.data);

      alert(err.response?.data?.message || "Unable to save complaint.");
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
              width: 250,
              height: 60,
              borderRadius: 10,
              backgroundColor: "#FFDF82",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ fontSize: 25 }}>Upload Photo</Text>
          </View>

          <TouchableOpacity
            onPress={selectPhoto}
            style={{
              width: wp(80),
              height: hp(7),
              marginTop: hp(2),
              borderWidth: 1,
              borderColor: "#999",
              borderRadius: 10,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {photo ? "Change Photo" : "📷 Select / Take Photo"}
            </Text>
          </TouchableOpacity>

          {photo && (
            <View
              style={{
                marginTop: hp(2),
                alignItems: "center",
              }}
            >
              {/* Small Image */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowFullImage(true)}
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={{
                    width: wp(70),
                    height: hp(25),
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Remove Photo */}
              <TouchableOpacity
                onPress={() => setPhoto(null)}
                style={{
                  marginTop: hp(1),
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Remove Photo
                </Text>
              </TouchableOpacity>

              {/* Full Screen Image Modal */}
              <Modal
                visible={showFullImage}
                transparent={false}
                animationType="fade"
                onRequestClose={() => setShowFullImage(false)}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Full Image */}
                  <Image
                    source={{ uri: photo.uri }}
                    style={{
                      width: wp(100),
                      height: hp(80),
                    }}
                    resizeMode="contain"
                  />

                  {/* X Close Button */}
                  <TouchableOpacity
                    onPress={() => setShowFullImage(false)}
                    style={{
                      position: "absolute",
                      top: hp(5),
                      right: wp(5),
                      width: 45,
                      height: 45,
                      borderRadius: 25,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          )}

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
            <Text style={{ fontSize: 25 }}>Upload Voice</Text>
          </View>

          {/* Voice Recording Section */}
          <View
            style={{
              width: wp(80),
              alignSelf: "center",
              marginTop: hp(2),
              padding: 15,
              backgroundColor: "white",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#DDD",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 12 }}>
              {isRecording
                ? "🔴 Recording voice..."
                : voice
                ? "Voice recording ready"
                : "Record complaint voice"}
            </Text>

            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={{
                backgroundColor: isRecording ? "#D32F2F" : "#2196F3",
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
              </Text>
            </TouchableOpacity>

            {voice && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ marginVertical: 8 }}>{voice.name}</Text>

                <TouchableOpacity
                  onPress={playVoice}
                  style={{
                    backgroundColor: "#4CAF50",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {isPlaying ? "▶ Play Again" : "▶ Play Voice"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={removeVoice}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    Remove Voice
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

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
