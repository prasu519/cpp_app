import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import AppDropdown from "../components/AppDropdown";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function DelayMessageComponent({
  slno,
  onDelete,
  onSelectFromHr,
  onSelectFromMin,
  onSelectToHr,
  onSelectToMin,
  selectedValueFromHr = "",
  selectedValueFromMin = "",
  selectedValueToHr = "",
  selectedValueToMin = "",
  descvalue = "",
  onChangeDesc,
  items,
  disable,
  xbuttoncolor = "#fc5c65",
  ...otherProps
}) {
  return (
    <View
      style={{
        height: hp(50),
        width: wp(85),
        backgroundColor: "#e9c46a",
        borderRadius: 25,
        gap: hp(1),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            height: hp(7),
            width: wp(14),
            backgroundColor: "orange",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: hp(4),
              fontWeight: "bold",
            }}
          >
            {slno}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: hp(7),
            width: wp(14),
            backgroundColor: xbuttoncolor,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
          onPress={onDelete}
          disabled={!disable}
        >
          <Text
            style={{
              fontSize: hp(4),
            }}
          >
            X
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          height: hp(8),
          width: wp(84),
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          gap: wp(2),
        }}
      >
        <Text
          style={{
            fontSize: hp(2.5),
            fontWeight: "bold",
            marginLeft: hp(2),
            alignSelf: "center",
          }}
        >
          From
        </Text>
        <AppDropdown
          id="fromhrs"
          items={items}
          selectedValue={selectedValueFromHr}
          onValueChange={onSelectFromHr}
          enable={disable}
        />
        <Text style={{ fontWeight: "bold", alignSelf: "center" }}>:</Text>
        <AppDropdown
          id="frommin"
          items={["", "00", "10", "20", "30", "40", "50"]}
          selectedValue={selectedValueFromMin}
          onValueChange={onSelectFromMin}
          enable={disable}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          height: hp(8),
          width: wp(84),
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          gap: wp(2),
        }}
      >
        <Text
          style={{
            fontSize: hp(2.5),
            fontWeight: "bold",
            marginLeft: hp(2),
            alignSelf: "center",
            marginRight: hp(3),
          }}
        >
          To
        </Text>
        <AppDropdown
          id="tohrs"
          items={items}
          selectedValue={selectedValueToHr}
          onValueChange={onSelectToHr}
          enable={disable}
          {...otherProps}
        />
        <Text style={{ fontWeight: "bold", alignSelf: "center" }}>:</Text>
        <AppDropdown
          id="tomin"
          items={["", "00", "10", "20", "30", "40", "50"]}
          selectedValue={selectedValueToMin}
          onValueChange={onSelectToMin}
          enable={disable}
          {...otherProps}
        />
      </View>
      <View
        style={{
          height: hp(20),
          width: wp(80),
          alignSelf: "center",
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: hp(2),
        }}
      >
        <TextInput
          style={{ margin: 10, fontSize: 20 }}
          multiline={true}
          placeholder="Enter description..."
          underlineColorAndroid={"transparent"}
          onChangeText={onChangeDesc}
          value={descvalue}
          editable={disable}
        ></TextInput>
      </View>
    </View>
  );
}
