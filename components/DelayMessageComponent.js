import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import AppDropdown from "../components/AppDropdown";

export default function DelayMessageComponent({
  slno,
  onDelete,
  onSelectFromHr,
  onSelectFromMin,
  onSelectToHr,
  onSelectToMin,
  selectedValueFromHr = "0",
  selectedValueFromMin = "0",
  selectedValueToHr = "0",
  selectedValueToMin = "0",
  onChangeDesc,
  ...otherProps
}) {
  return (
    <View
      style={{
        height: 320,
        width: "90%",
        backgroundColor: "#e9c46a",
        borderRadius: 25,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            height: 50,
            width: 50,
            backgroundColor: "orange",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {slno}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            backgroundColor: "#FB6D48",
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
          onPress={onDelete}
        >
          <Text
            style={{
              fontSize: 25,
            }}
          >
            X
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          height: 60,
          width: "85%",
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          gap: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 10,
            alignSelf: "center",
          }}
        >
          From
        </Text>
        <AppDropdown
          id="str2hrs"
          items={[
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ]}
          selectedValue={selectedValueFromHr || "0"}
          onValueChange={onSelectFromHr}
        />
        <Text style={{ fontWeight: "bold", alignSelf: "center" }}>:</Text>
        <AppDropdown
          id="str2min"
          items={["00", "10", "20", "30", "40", "50"]}
          selectedValue={selectedValueFromMin || "0"}
          onValueChange={onSelectFromMin}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 60,
          width: "85%",
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          gap: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 20,
            marginRight: 25,
            alignSelf: "center",
          }}
        >
          To
        </Text>
        <AppDropdown
          id="str2hrs"
          items={[
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ]}
          selectedValue={selectedValueToHr || "0"}
          onValueChange={onSelectToHr}
          {...otherProps}
        />
        <Text style={{ fontWeight: "bold", alignSelf: "center" }}>:</Text>
        <AppDropdown
          id="str2min"
          items={["00", "10", "20", "30", "40", "50"]}
          selectedValue={selectedValueToMin || "0"}
          onValueChange={onSelectToMin}
          {...otherProps}
        />
      </View>
      <View
        style={{
          height: "30%",
          width: "95%",
          alignSelf: "center",
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <TextInput
          style={{ margin: 10, fontSize: 20 }}
          multiline={true}
          placeholder="Enter description..."
          underlineColorAndroid={"transparent"}
          onChangeText={onChangeDesc}
        ></TextInput>
      </View>
    </View>
  );
}
