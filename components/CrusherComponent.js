import { View, Text } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Picker } from "@react-native-picker/picker";
import AppTextBox from "../components/AppTextBox";
import FieldSet from "react-native-fieldset";

export default function CrusherComponent({
  number,
  colour,
  onChangeStatus,
  selectedStatus = "",
  onChangeFeeder,
  selectedFeeder = "",
  onChangeCurrent,
  valueCurrent = "",
  onChangeRpm,
  valueRpm = "",
  onChangeTcol,
  selectedTcol = "",
  onChangeTcop,
  valueTcop = "",
  onChangeTcot,
  valueTcot = "",
  onChangeGbol,
  selectedGbol = "",
  onChangeGbop,
  valueGbop = "",
  onChangeGbot,
  valueGbot = "",
}) {
  return (
    <FieldSet label="Crusher Component">
      <View>
        <View
          style={{
            width: wp(40),
            height: hp(6),
            backgroundColor: colour,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: wp(3),

            borderRadius: wp(2),
          }}
        >
          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
            {"Crusher-" + number}
          </Text>
        </View>

        <View style={{ width: wp(83), borderBottomWidth: wp(0.1) }}></View>
        <View style={{ alignItems: "center", marginTop: wp(10), gap: wp(5) }}>
          <View style={{ flexDirection: "row", marginLeft: wp(3) }}>
            <View
              style={{
                width: wp(30),
                backgroundColor: colour,
                height: hp(6),
                justifyContent: "center",
                borderRadius: 25,
                paddingLeft: wp(3),
                marginBottom: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: wp(4.5),
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "left",
                }}
              >
                STATUS
              </Text>
            </View>
            <Picker
              id={1}
              style={{
                width: wp(40),
                height: hp(2),
                backgroundColor: "white",
                marginLeft: wp(7),
              }}
              mode="dropdown"
              enabled={true}
              onValueChange={onChangeStatus}
              selectedValue={selectedStatus}
            >
              {["", "InUse", "StandBy", "Repair"].map((status) => (
                <Picker.Item
                  key={status}
                  label={status.toString()}
                  value={status}
                  style={{ fontSize: hp(2) }}
                />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: "row", gap: wp(7) }}>
            <View
              style={{
                width: wp(30),
                backgroundColor: colour,
                height: hp(6),
                justifyContent: "center",
                borderRadius: 25,
                paddingLeft: wp(3),
                marginBottom: wp(5),
              }}
            >
              <Text
                style={{
                  fontSize: wp(4.5),
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "left",
                }}
              >
                FEEDER
              </Text>
            </View>
            <Picker
              id={1}
              style={{
                width: wp(30),
                height: hp(2),
                backgroundColor: "white",
                marginLeft: wp(7),
              }}
              mode="dropdown"
              enabled={true}
              onValueChange={onChangeFeeder}
              selectedValue={selectedFeeder}
            >
              {["", "1", "2"].map((status) => (
                <Picker.Item
                  key={status}
                  label={status.toString()}
                  value={status}
                  style={{ fontSize: hp(2) }}
                />
              ))}
            </Picker>
          </View>
          {/*
          <AppTextBox
            label={"Current"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(8)}
            onChangeText={onChangeCurrent}
            value={valueCurrent}
            maxLength={4}
          />
          <AppTextBox
            label={"RPM"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(8)}
            onChangeText={onChangeRpm}
            //onBlur={() => setFieldTouched(item)}
            value={valueRpm}
            maxLength={4}
            //placeholder={item === "ci" ? "%" : ""}
          />
          */}
        </View>
        {/*
        <View
          style={{
            width: wp(50),
            height: hp(4),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: wp(10),
            marginTop: wp(10),
            borderBottomWidth: wp(0.3),
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
            Turbo Coupling
          </Text>
        </View>

        <View style={{ alignItems: "center", gap: wp(7) }}>
          <View style={{ flexDirection: "row", gap: wp(6) }}>
            <View
              style={{
                width: wp(35),
                backgroundColor: "#e9c46a",
                height: hp(6),
                justifyContent: "center",
                borderRadius: 25,
                paddingLeft: wp(3),
              }}
            >
              <Text
                style={{
                  fontSize: wp(4.5),
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "left",
                }}
              >
                OIL LEVEL
              </Text>
            </View>
            <Picker
              id={1}
              style={{
                width: wp(32),
                backgroundColor: "white",
                marginLeft: wp(7),
              }}
              mode="dropdown"
              enabled={true}
              onValueChange={onChangeTcol}
              selectedValue={selectedTcol}
            >
              {["", "High", "Normal", "Low"].map((status) => (
                <Picker.Item
                  key={status}
                  label={status.toString()}
                  value={status}
                  style={{ fontSize: status === "Normal" ? hp(1.4) : hp(2) }}
                />
              ))}
            </Picker>
          </View>
          <AppTextBox
            label={"oil Pressure"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(9)}
            onChangeText={onChangeTcop}
            value={valueTcop}
            maxLength={4}
          />
          <AppTextBox
            label={"oil Temp"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(9)}
            onChangeText={onChangeTcot}
            Value={valueTcot}
            maxLength={4}
          />
        </View>

        <View
          style={{
            width: wp(50),
            height: hp(4),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: wp(10),
            marginTop: wp(10),
            borderBottomWidth: wp(0.3),
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>Gear Box</Text>
        </View>

        <View style={{ alignItems: "center", gap: wp(7) }}>
          <View style={{ flexDirection: "row", gap: wp(6) }}>
            <View
              style={{
                width: wp(35),
                backgroundColor: "#e9c46a",
                height: hp(6),
                justifyContent: "center",
                borderRadius: 25,
                paddingLeft: wp(3),
              }}
            >
              <Text
                style={{
                  fontSize: wp(4.5),
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "left",
                }}
              >
                OIL LEVEL
              </Text>
            </View>
            <Picker
              id={1}
              style={{
                width: wp(32),
                backgroundColor: "white",
                marginLeft: wp(7),
              }}
              mode="dropdown"
              enabled={true}
              onValueChange={onChangeGbol}
              selectedValue={selectedGbol}
            >
              {["", "High", "Normal", "Low"].map((status) => (
                <Picker.Item
                  key={status}
                  label={status.toString()}
                  value={status}
                  style={{ fontSize: status === "Normal" ? hp(1.4) : hp(2) }}
                />
              ))}
            </Picker>
          </View>
          <AppTextBox
            label={"oil Pressure"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(9)}
            onChangeText={onChangeGbop}
            value={valueGbop}
            maxLength={4}
          />
          <AppTextBox
            label={"oil Temp"}
            labelcolor="#e9c46a"
            tbSize="30%"
            lbSize={wp(9)}
            onChangeText={onChangeGbot}
            value={valueGbot}
            maxLength={4}
          />
        </View>*/}
      </View>
    </FieldSet>
  );
}
