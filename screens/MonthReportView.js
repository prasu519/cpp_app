import { View, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import axios from "axios";
import { Text, Divider } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FormatDate } from "../utils/FormatDate";

export default function MonthReportView({ navigation }) {
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [blendData, setBlendData] = useState({});
  const [avgCI, setAvgCI] = useState();
  const [totalFeeding, setTotalFeeding] = useState();
  const [totalRecl, setTotalRecl] = useState();
  const [totByCoalNamesCpp1, setTotByCoalNamesCpp1] = useState();
  const [totByCoalNamesCpp3, setTotByCoalNamesCpp3] = useState();
  const [prevDayCShiftCTStock, setPrevDayCShiftCTStock] = useState();
  const [toDateCShiftCTStock, setToDateCShiftCTStock] = useState();
  const [prevDayDate, setPrevDayDate] = useState();
  const [toDateDate, setToDateDate] = useState();
  const [totalPushings, setTotalPushings] = useState();

  const handleFromDateChange = (event, date) => {
    setShowFromDatePicker(false);
    if (date) {
      setSelectedFromDate(date);
    }
  };
  const handleToDateChange = (event, date) => {
    setShowToDatePicker(false);
    if (date) {
      setSelectedToDate(date);
    }
  };

  const getAvgCI = async (fromDate, toDate) => {
    try {
      const response = await axios.get(BaseUrl + "/coalAnalysis/avgci", {
        params: {
          fromdate: fromDate,
          todate: toDate,
        },
      });
      setAvgCI(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch average C.I . Please check the date and try again."
      );
    }
  };

  const getTotalFeeding = async (fromDate, toDate) => {
    try {
      const response = await axios.get(BaseUrl + "/feeding/totfeeding", {
        params: {
          fdate: fromDate,
          tdate: toDate,
        },
      });
      setTotalFeeding(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getTotalRecl = async (fromDate, toDate) => {
    try {
      const response = await axios.get(BaseUrl + "/reclaiming/totrecl", {
        params: {
          fdate: fromDate,
          tdate: toDate,
        },
      });
      setTotalRecl(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getTotalReclByCoalNameCpp1 = async (fromDate, toDate) => {
    try {
      const response = await axios.get(BaseUrl + "/reclaiming/totByCoalNames", {
        params: {
          fdate: fromDate,
          tdate: toDate,
        },
      });
      setTotByCoalNamesCpp1(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getTotalReclByCoalNameCpp3 = async (fromDate, toDate) => {
    try {
      const response = await axios.get(
        BaseUrl + "/reclaiming/totByCoalNamesCpp3",
        {
          params: {
            fdate: fromDate,
            tdate: toDate,
          },
        }
      );
      setTotByCoalNamesCpp3(response.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getPrevDayCShiftCTStock = async (fromDate) => {
    const pdate = new Date(fromDate);
    pdate.setDate(pdate.getDate() - 1);
    const prvdate = pdate.toISOString().split("T")[0];
    setPrevDayDate(prvdate);
    try {
      const responce = await axios.get(BaseUrl + "/coaltowerstock", {
        params: {
          date: prvdate,
          shift: "C",
        },
      });
      setPrevDayCShiftCTStock(responce.data.data[0]);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getToDateCShiftCTStock = async (toDate) => {
    setToDateDate(toDate);
    try {
      const responce = await axios.get(BaseUrl + "/coaltowerstock", {
        params: {
          date: toDate,
          shift: "C",
        },
      });
      setToDateCShiftCTStock(responce.data.data[0]);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total feedig cpp1. Please check the date and try again."
      );
    }
  };
  const getTotalPushings = async (fromDate, toDate) => {
    try {
      const responce = await axios.get(BaseUrl + "/pushings/totpush", {
        params: { fromdate: fromDate, todate: toDate },
      });
      setTotalPushings(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch total pushings. Please check the date and try again."
      );
    }
  };

  const handleSubmit = async () => {
    const todaydate = new Date();

    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];
    let todayDate = new Date(todaydate).toISOString().split("T")[0];

    if (toDate >= todayDate) {
      Alert.alert("Invalid Date", "To Date should be less than today's date.");
      return; // Exit the function
    }
    if (fromDate >= todayDate) {
      Alert.alert(
        "Invalid Date",
        "From Date should be less than today's date."
      );
      return; // Exit the function
    }

    await getAvgCI(fromDate, toDate);
    await getTotalFeeding(fromDate, toDate);
    await getTotalRecl(fromDate, toDate);
    await getPrevDayCShiftCTStock(fromDate);
    await getToDateCShiftCTStock(toDate);
    await getTotalPushings(fromDate, toDate);
    await getTotalReclByCoalNameCpp1(fromDate, toDate);
    await getTotalReclByCoalNameCpp3(fromDate, toDate);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          height: hp(15),
          width: wp(100),
          backgroundColor: "#2FF3E0",
          borderBottomLeftRadius: hp(8),
          borderBottomRightRadius: hp(8),
        }}
      >
        <View
          style={{
            paddingTop: hp(5),
            paddingLeft: hp(2),
            flexDirection: "row",
            alignItems: "center",
            gap: wp(12),
          }}
        >
          <AntDesign
            name="leftcircle"
            size={40}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              fontSize: wp(6),
              borderBottomWidth: 2,
              color: "black",
              alignSelf: "center",
              fontWeight: "bold",
            }}
          >
            Month Report View
          </Text>
        </View>
      </View>
      <View
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: hp(15),
          padding: hp(2),
          gap: wp(2),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: wp(2),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: hp(10),
            width: wp(80),
            backgroundColor: "lightgrey",
            borderRadius: 25,
          }}
        >
          <Button
            title="From Date"
            buttonStyle={{ width: wp(40), height: hp(5) }}
            titleStyle={{
              fontSize: hp(2),
              color: "white",
              borderBottomWidth: 2,
              borderBottomColor: "white",
            }}
            radius={25}
            onPress={() => setShowFromDatePicker(true)}
          />
          {showFromDatePicker && (
            <DateTimePicker
              value={selectedFromDate}
              mode="date"
              display="spinner"
              onChange={handleFromDateChange}
            />
          )}
          <Text style={{ fontSize: hp(2.5), color: "green" }}>
            {FormatDate(selectedFromDate)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: wp(2),
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: hp(10),
            width: wp(80),
            backgroundColor: "lightgrey",
            borderRadius: 25,
          }}
        >
          <Button
            title="To Date"
            buttonStyle={{ width: wp(40), height: hp(5) }}
            titleStyle={{
              fontSize: hp(2),
              color: "white",
              borderBottomWidth: 2,
              borderBottomColor: "white",
            }}
            radius={25}
            onPress={() => setShowToDatePicker(true)}
          />
          {showToDatePicker && (
            <DateTimePicker
              value={selectedToDate}
              mode="date"
              display="spinner"
              onChange={handleToDateChange}
            />
          )}
          <Text style={{ fontSize: hp(2.5), color: "green" }}>
            {FormatDate(selectedToDate)}
          </Text>
        </View>

        <Button
          title={"Submit"}
          color={"#000080"}
          buttonStyle={{
            height: hp(5),
            width: wp(40),
            marginTop: hp(2),
            alignSelf: "center",
          }}
          radius={20}
          titleStyle={{
            textDecorationLine: "underline",
            fontSize: hp(2),
            fontWeight: "600",
          }}
          onPress={handleSubmit}
        />
      </View>
      <ScrollView>
        {avgCI !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Average CI - " + Number(avgCI).toFixed(2)}
            </Card.Title>
          </Card>
        )}
        {prevDayCShiftCTStock !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {prevDayDate +
                "/C-Shift CT Stock - " +
                prevDayCShiftCTStock.total_stock}
            </Card.Title>
          </Card>
        )}
        {totalFeeding !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Stream1 Feeding - " + totalFeeding.totalStream1}
            </Card.Title>
          </Card>
        )}
        {totalFeeding !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Stream1A Feeding - " + totalFeeding.totalStream1A}
            </Card.Title>
          </Card>
        )}
        {totalFeeding !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CPP3 Feeding - " + totalFeeding.totalPathC}
            </Card.Title>
          </Card>
        )}
        {toDateCShiftCTStock !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {toDateDate +
                "/C-Shift CT Stock - " +
                toDateCShiftCTStock.total_stock}
            </Card.Title>
          </Card>
        )}
        {toDateCShiftCTStock !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Feeding Consumption - " +
                (prevDayCShiftCTStock.total_stock +
                  totalFeeding.totalStream1 +
                  totalFeeding.totalStream1A +
                  totalFeeding.totalPathC -
                  toDateCShiftCTStock.total_stock)}
            </Card.Title>
          </Card>
        )}
        {totalPushings !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Total Pushings - " + totalPushings}
            </Card.Title>
          </Card>
        )}
        {totalPushings !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Charge/Oven - " +
                (
                  (prevDayCShiftCTStock.total_stock +
                    totalFeeding.totalStream1 +
                    totalFeeding.totalStream1A +
                    totalFeeding.totalPathC -
                    toDateCShiftCTStock.total_stock) /
                  totalPushings
                ).toFixed(2)}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CC49 Reclaiming - " + totalRecl.totCC49Recl}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CC50 Reclaiming - " + totalRecl.totCC50Recl}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CC126 Reclaiming - " + totalRecl.totCC126Recl}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CPP1 Reclaiming - " + totalRecl.totCpp1Recl}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CPP3 Reclaiming - " + totalRecl.totCpp3Recl}
            </Card.Title>
          </Card>
        )}
        {totByCoalNamesCpp1 !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CPP1 Coal Wise Reclaiming"}
            </Card.Title>

            {Object.entries(totByCoalNamesCpp1).map(
              ([coalName, total], index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: wp(5),
                  }}
                >
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {coalName}
                  </Text>
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {total}
                  </Text>
                </View>
              )
            )}

            <Card.Divider />
          </Card>
        )}

        {totByCoalNamesCpp3 !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"CPP3 Coal Wise Reclaiming"}
            </Card.Title>

            {Object.entries(totByCoalNamesCpp3).map(
              ([coalName, total], index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: wp(5),
                  }}
                >
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {coalName}
                  </Text>
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {total}
                  </Text>
                </View>
              )
            )}

            <Card.Divider />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
