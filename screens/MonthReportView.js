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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFromShift, setSelectedFromShift] = useState();
  const [selectedToShift, setSelectedToShift] = useState();
  const [selectedShift, setSelectedShift] = useState("");
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
  const [crusherFeedersTotal, setCrusherFeedersTotal] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFromDateChange = (event, date) => {
    setShowFromDatePicker(false);
    if (date) {
      //let correctDate = new Date(date);
      //correctDate.setDate(correctDate.getDate() + 1);
      setSelectedFromDate(date);
    }
  };
  const handleToDateChange = (event, date) => {
    setShowToDatePicker(false);
    if (date) {
      //let correctDate = new Date(date);
      //correctDate.setDate(correctDate.getDate() + 1);
      setSelectedToDate(date);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const getAvgCI = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const response = await axios.get(BaseUrl + "/coalAnalysis/avgci", {
        params: {
          fromdate: fromDate,
          fromshift: fromShift,
          todate: toDate,
          toshift: toShift,
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

  const getTotalFeeding = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const response = await axios.get(BaseUrl + "/feeding/totfeeding", {
        params: {
          fdate: fromDate,
          fshift: fromShift,
          tdate: toDate,
          tshift: toShift,
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
  const getTotalRecl = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const response = await axios.get(BaseUrl + "/reclaiming/totrecl", {
        params: {
          fdate: fromDate,
          fshift: fromShift,
          tdate: toDate,
          tshift: toShift,
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
  const getTotalReclByCoalNameCpp1 = async (
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    try {
      const response = await axios.get(BaseUrl + "/reclaiming/totByCoalNames", {
        params: {
          fdate: fromDate,
          fshift: fromShift,
          tdate: toDate,
          tshift: toShift,
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
  const getTotalReclByCoalNameCpp3 = async (
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    try {
      const response = await axios.get(
        BaseUrl + "/reclaiming/totByCoalNamesCpp3",
        {
          params: {
            fdate: fromDate,
            fshift: fromShift,
            tdate: toDate,
            tshift: toShift,
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
  const getPrevDayCShiftCTStock = async (fromDate, fromShift) => {
    let prevShift;
    let prvdate;
    if (fromShift == "A") {
      prevShift = "C";
      const pdate = new Date(fromDate);
      pdate.setDate(pdate.getDate() - 1);
      prvdate = pdate.toISOString().split("T")[0];
      setPrevDayDate(prvdate);
    }
    if (fromShift == "B") prevShift = "A";
    if (fromShift == "C") prevShift = "B";

    try {
      const responce = await axios.get(BaseUrl + "/coaltowerstock", {
        params: {
          date: fromShift === "A" ? prvdate : fromDate,
          shift: prevShift,
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
  const getToDateCShiftCTStock = async (toDate, toShift) => {
    setToDateDate(toDate);
    try {
      const responce = await axios.get(BaseUrl + "/coaltowerstock", {
        params: {
          date: toDate,
          shift: toShift,
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
  const getTotalPushings = async (fromDate, fromShift, toDate, toShift) => {
    try {
      const responce = await axios.get(BaseUrl + "/pushings/totpush", {
        params: {
          fromdate: fromDate,
          fromshift: fromShift,
          todate: toDate,
          toshift: toShift,
        },
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
  const getCrusherFeedersTotal = async (
    fromDate,
    fromShift,
    toDate,
    toShift
  ) => {
    try {
      const responce = await axios.get(BaseUrl + "/crusher/feedersTotal", {
        params: {
          fdate: fromDate,
          fshift: fromShift,
          tdate: toDate,
          tshift: toShift,
        },
      });
      setCrusherFeedersTotal(responce.data.data);
    } catch (error) {
      console.log(error);
      alert(
        "Error",
        "Failed to fetch crusher feeders total. Please check the date and try again."
      );
    }
  };

  const handleSubmit = async () => {
    if (selectedFromShift === undefined || selectedToShift == undefined) {
      alert("please enter shift");
      return;
    }
    const todaydate = new Date();
    let fromDate = new Date(selectedFromDate).toISOString().split("T")[0];
    let fromShift = selectedFromShift;
    let toDate = new Date(selectedToDate).toISOString().split("T")[0];
    let toShift = selectedToShift;
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
    if (fromDate > toDate) {
      Alert.alert(
        "Invalid Date",
        "From Date should be less than To Date date."
      );
      return; // Exit the function
    }
    if (fromDate == toDate && fromShift > toShift) {
      Alert.alert(
        "Invalid Date",
        "From Shift should be less than To shift in same date."
      );
      return; // Exit the function
    }

    await getAvgCI(fromDate, fromShift, toDate, toShift);
    await getTotalFeeding(fromDate, fromShift, toDate, toShift);
    await getTotalRecl(fromDate, fromShift, toDate, toShift);
    await getPrevDayCShiftCTStock(fromDate, fromShift);
    await getToDateCShiftCTStock(toDate, toShift);
    await getTotalPushings(fromDate, fromShift, toDate, toShift);
    await getTotalReclByCoalNameCpp1(fromDate, fromShift, toDate, toShift);
    await getTotalReclByCoalNameCpp3(fromDate, fromShift, toDate, toShift);
    await getCrusherFeedersTotal(fromDate, fromShift, toDate, toShift);
  };

  const formatItem = (str) => {
    const match = str.match(/^([a-zA-Z]+)(\d+)([A-Za-z]+)(\d+)/);
    if (!match) return str;

    const [, prefix, num1, word, num2] = match;
    return `${prefix.slice(0, 2).toUpperCase()}-${num1} ${
      word.charAt(0).toUpperCase() + word.slice(1)
    }-${num2}`;
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
      <ScrollView>
        <View
          style={{
            position: "relative",
            marginTop: hp(15),
            padding: hp(2),
            gap: wp(2),
            height: hp(55),
            backgroundColor: "#EFECE3",
            borderRadius: 20,
            top: wp(1),
            borderWidth: 0.5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(5),
              width: wp(50),
              backgroundColor: "lightgreen",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: wp(6),
                color: "black",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              From
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(90),
              backgroundColor: "lightgrey",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(2),
                alignItems: "center",
                justifyContent: "center",
                height: hp(5),
                width: wp(45),
              }}
            >
              <Button
                title="Date"
                buttonStyle={{ width: wp(18), height: hp(5) }}
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
              <Text style={{ fontSize: hp(2), color: "red" }}>
                {selectedFromDate.toISOString().split("T")[0]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(1),
                alignItems: "center",
                height: hp(5),
                width: wp(40),
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  height: hp(5),
                  width: wp(18),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#6495ED",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Shift
                </Text>
              </View>
              <Picker
                id="Shift"
                style={{
                  width: wp(25),
                }}
                mode="dropdown"
                enabled={true}
                onValueChange={(shift) => setSelectedFromShift(shift)}
                selectedValue={selectedFromShift}
              >
                {[" ", "A", "B", "C"].map((shift) => (
                  <Picker.Item
                    key={shift}
                    label={shift.toString()}
                    value={shift}
                    style={{ fontSize: hp(2), color: "red" }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View
            style={{
              width: wp(90),
              marginVertical: wp(7),
              borderBottomColor: "lightgrey",
              borderBottomWidth: wp(0.5),
              top: hp(1),
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(5),
              width: wp(20),
              backgroundColor: "lightgreen",
              borderRadius: 25,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: wp(6),
                color: "black",
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              To
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(90),
              backgroundColor: "lightgrey",
              borderRadius: 25,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(2),
                alignItems: "center",
                justifyContent: "center",
                height: hp(5),
                width: wp(45),
              }}
            >
              <Button
                title="Date"
                buttonStyle={{ width: wp(18), height: hp(5) }}
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
              <Text style={{ fontSize: hp(2), color: "red" }}>
                {selectedToDate.toISOString().split("T")[0]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(1),
                alignItems: "center",
                height: hp(5),
                width: wp(40),
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  height: hp(5),
                  width: wp(18),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#6495ED",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(2),
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Shift
                </Text>
              </View>
              <Picker
                id="Shift"
                style={{
                  width: wp(25),
                }}
                mode="dropdown"
                enabled={true}
                onValueChange={(shift) => setSelectedToShift(shift)}
                selectedValue={selectedToShift}
              >
                {[" ", "A", "B", "C"].map((shift) => (
                  <Picker.Item
                    key={shift}
                    label={shift.toString()}
                    value={shift}
                    style={{ fontSize: hp(2), color: "red" }}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/*  <View
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
        </View>*/}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              height: hp(10),
              width: wp(80),

              borderRadius: 25,
            }}
          >
            <Button
              title={"Submit"}
              color={"#000080"}
              buttonStyle={{
                height: hp(6),
                width: wp(40),
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
        </View>

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
              {"Opening CT Stock - " + prevDayCShiftCTStock.total_stock}
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

        {totalFeeding !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Feeding to Coal Towers"}
            </Card.Title>
            <Card.Divider />
            <View style={{ marginTop: 10 }}>
              {["Ct1", "Ct2", "Ct3"].map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "row",
                    gap: hp(3),
                  }}
                >
                  <View
                    style={{
                      width: wp(30),
                      alignItems: "flex-end",
                    }}
                  >
                    <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                      {item.toUpperCase()}
                    </Text>
                  </View>
                  <Divider orientation="vertical" />
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {totalFeeding["total" + item]}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {crusherFeedersTotal !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Crushed Coal by feeders"}
            </Card.Title>
            <Card.Divider />
            <View style={{ marginTop: 10 }}>
              {[
                "cr34Feeder1Total",
                "cr34Feeder2Total",
                "cr35Feeder1Total",
                "cr35Feeder2Total",
                "cr36Feeder1Total",
                "cr36Feeder2Total",
                "cr37Feeder1Total",
                "cr37Feeder2Total",
                "cr38Feeder1Total",
                "cr38Feeder2Total",
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: wp(5),
                    gap: hp(3),
                  }}
                >
                  <View
                    style={{
                      width: wp(40),
                      alignItems: "flex-end",
                    }}
                  >
                    <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                      {formatItem(item)}
                    </Text>
                  </View>
                  <Divider orientation="vertical" />
                  <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                    {crusherFeedersTotal[item]}
                  </Text>
                </View>
              ))}
            </View>

            {/* <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr34 Feeder-1 "}
              {crusherFeedersTotal.cr34Feeder1Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr34 Feeder-2 "}
              {crusherFeedersTotal.cr34Feeder2Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr35 Feeder-1 "}
              {crusherFeedersTotal.cr35Feeder1Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr35 Feeder-2 Total - " + crusherFeedersTotal.cr35Feeder2Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr36 Feeder-1 Total - " + crusherFeedersTotal.cr36Feeder1Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr36 Feeder-2 Total - " + crusherFeedersTotal.cr36Feeder2Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr37 Feeder-1 Total - " + crusherFeedersTotal.cr37Feeder1Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr37 Feeder-2 Total - " + crusherFeedersTotal.cr37Feeder2Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr38 Feeder-1 Total - " + crusherFeedersTotal.cr38Feeder1Total}
            </Card.Title>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Cr38 Feeder-2 Total - " + crusherFeedersTotal.cr38Feeder2Total}
            </Card.Title>*/}
          </Card>
        )}
        {toDateCShiftCTStock !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Closing CT Stock - " + toDateCShiftCTStock.total_stock}
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
              {"Path A Reclaiming - " + totalRecl.totPathARecl}
            </Card.Title>
          </Card>
        )}
        {totalRecl !== undefined && (
          <Card>
            <Card.Title h4 h4Style={{ color: "#6495ED" }}>
              {"Path B Reclaiming - " + totalRecl.totPathBRecl}
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
