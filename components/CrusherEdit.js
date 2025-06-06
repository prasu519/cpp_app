import { View, Text, TextInput } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Picker } from "@react-native-picker/picker";

const CrusherEdit = ({
  label,
  labelcolor = "white",
  tbSize = 30,
  lbSize = 40,
  onChangeStatus,
  selectedStatus = "",
  onChangeFeeder,
  selectedFeeder = "",
  editable = false,
  ...otherProps
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: wp(85),
        height: hp(8),
        marginBottom: hp(1),
        marginTop: hp(1),
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: wp(20),
          backgroundColor: labelcolor,
          height: hp(6),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Text
          style={{
            fontSize: wp(7),
            fontWeight: "bold",
            color: "black",
          }}
        >
          {label}
        </Text>
      </View>
      <Picker
        id={1}
        style={{
          width: wp(37),
          backgroundColor: "white",
          marginLeft: wp(2),
        }}
        mode="dropdown"
        enabled={editable}
        onValueChange={onChangeStatus}
        selectedValue={selectedStatus}
      >
        {["", "InUse", "StandBy", "Repair"].map((status) => (
          <Picker.Item
            key={status}
            label={status.toString()}
            value={status}
            style={{ fontSize: wp(4) }}
          />
        ))}
      </Picker>
      <View
        style={{
          borderRadius: 25,
          width: wp(20),
          height: hp(6),
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <Picker
          id={1}
          style={{
            width: wp(25),
            backgroundColor: "white",
            marginLeft: wp(6),
          }}
          mode="dropdown"
          enabled={editable}
          onValueChange={onChangeFeeder}
          selectedValue={selectedFeeder}
        >
          {["", "1", "2"].map((status) => (
            <Picker.Item
              key={status}
              label={status.toString()}
              value={status}
              style={{ fontSize: wp(4) }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default CrusherEdit;
