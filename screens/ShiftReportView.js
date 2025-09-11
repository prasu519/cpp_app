//date
import { View, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect, useContext } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Button, Card } from "@rneui/base";
import axios from "axios";
import { Text, Divider } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { FormatDate } from "../utils/FormatDate";
import DeleteShiftReportAuthentication from "./DeleteShiftReportAuthentication";
import EditShiftReportAuthentication from "./EditShiftReportAuthentication";
import { GlobalContext } from "../contextApi/GlobalContext";
import DoneScreen from "./DoneScreen";

export default function ShiftReportView({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");

  const [feeding, setFeeding] = useState();
  const [reclaiming, setReclaiming] = useState();
  const [blend, setBlend] = useState();
  const [coalTowerStock, setCoalTowerStock] = useState();
  const [mbTopStock, setMbTopStock] = useState();
  const [runningHours, setRunningHours] = useState();
  const [shiftDelays, setShiftDelays] = useState();
  const [coalAnalysis, setCoalAnalysis] = useState();
  const [pushingSchedule, setPushingSchedule] = useState();
  const [crusherStatus, setCrusherStatus] = useState();
  const [shiftReportEnteredBy, setShiftReportEnteredBy] = useState();

  const [coalCount, setCoalCount] = useState(0);
  const [blendCount, setBlendCount] = useState(0);
  const [loadCard, setLoadCard] = useState(false);
  const [clickSubmit, setClickSubmit] = useState(false);
  const [latestRecord, setLatestRecord] = useState();
  const [loadLatestRecord, setLoadLatestRecord] = useState(false);

  const [delAuthModelVisible, setDelAuthModelVisible] = useState(false);
  const [editAuthModelVisible, setEditAuthModelVisible] = useState(false);

  const [doneScreen, setDoneScreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    credentials,
    setCredentials,
    reclaimingData,
    setReclaimingData,
    feedingData,
    setFeedingData,
    runningHoursData,
    setRunningHoursData,
    shiftDelaysData,
    setShiftDelaysData,
    mbTopStockData,
    setMbTopStockData,
    coalTowerStockData,
    setCoalTowerStockData,
    coalAnalysisData,
    setCoalAnalysisData,
    pushingScheduleData,
    setPushingScheduleData,
    allCrushersData,
    setAllCrushersData,
    globalDate,
    setGlobalDate,
    globalShift,
    setGlobalShift,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (reclaiming) {
      let count = 0;
      for (let i = 1; i <= 8; i++) {
        if (reclaiming["coal" + i + "name"] != null) {
          count++;
        }
      }
      setCoalCount(count);
    }
  }, [reclaiming]);

  useEffect(() => {
    const getLatestRecord = async () => {
      await axios
        .get(BaseUrl + "/shiftreportenteredbylatest")
        .then((response) => {
          setLatestRecord(response.data.data);
          setLoadLatestRecord(true);
        })
        .catch((error) => {
          alert("latest record not found  " + error);
        });
    };
    getLatestRecord();
  }, []);

  const generatePDF = async () => {
    try {
      const htmlContent = `
          <html>
            <body>
              <div style="flex-direction: column;align-items: center;justify-content: center; text-align:center; width: 800px; height:100px;">
                <h1 style="text-decoration: underline;">CPP Shift Report</h1>
                <div style=" flex-direction: row; gap:30px">
                  <span style="font-size: 20px; font-weight:bold; margin-left:10px">
                    Date : ${selectedDate.toISOString().split("T")[0]}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style="font-size: 20px; font-weight:bold; text-align:right; margin-right:10px">
                    Shift : ${selectedShift}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style="font-size: 20px; font-weight:bold; text-align:right; margin-right:10px">
                    Name : ${shiftReportEnteredBy.name}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style="font-size: 20px; font-weight:bold; text-align:right; margin-right:10px">
                    Emp No : ${shiftReportEnteredBy.empnum}
                  </span>
                </div>
             </div>
             <div style= "display:flex; flex-direction:row; width:780px; height:930px;  margin-top:5px;border:2px solid black;align-self: center;margin-left:10px;margin-right:10px">
               <div style=" flex-direction:column;  display: inline-block; float: left; width:400px;float:left; border-right: 2px solid black; text-align:center;align-items:flex-start; margin-right:10px">
                 <p style="text-decoration: underline; font-size: 24px; font-weight:bold"; margin-bottom: 5px;>Reclaiming Data</p>              
                 ${Array.from({ length: 8 }, (_, index) =>
                   reclaiming["coal" + (index + 1) + "name"] === "" &&
                   reclaiming["coal" + (index + 1) + "recl"] === 0
                     ? null
                     : `
                  <div style="margin: 10px;  flex-direction: row; ">
                    <p style=" display: flex; justify-content: space-between;">
                    <span style="font-size: 17px; font-weight:bold">
                      ${reclaiming["coal" + (index + 1) + "name"].toUpperCase()}
                    </span>
                    <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        reclaiming["coal" + (index + 1) + "recl"] === 0
                          ? "000"
                          : reclaiming["coal" + (index + 1) + "recl"]
                      }
                    </span>
                    </p>
                  </div>
                  `
                 ).join("")}

                  ${Array.from({ length: 8 }, (_, index) =>
                    reclaiming["excoal" + (index + 1) + "name"] === "" &&
                    reclaiming["excoal" + (index + 1) + "recl"] === 0
                      ? null
                      : `
                      <div style="margin: 10px;  flex-direction: row; ">
                      <p style=" display: flex; justify-content: space-between;">
                      <span style="font-size: 17px; font-weight:bold">
                      ${reclaiming[
                        "excoal" + (index + 1) + "name"
                      ].toUpperCase()}
                      </span>
                      <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        reclaiming["excoal" + (index + 1) + "recl"] === 0
                          ? "000"
                          : reclaiming["excoal" + (index + 1) + "recl"]
                      }
                      </span>
                    </p>
                  </div>
                  `
                  ).join("")}
                  <p style="font-size: 24px; font-weight:bold"> 
                    Total 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
                    ${reclaiming.total_reclaiming}
                  </p> 
                  ${["cc49", "cc50", "cc126"]
                    .map(
                      (item, index) =>
                        `
                  <div style="margin: 10px; flex-direction: row; ">
                    <p style=" display: flex; justify-content: space-between;"> 
                      <span style="font-size: 17px; font-weight:bold">${item.toUpperCase()}</span>
                      <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        reclaiming[item + "recl"] === 0
                          ? "000"
                          : reclaiming[item + "recl"]
                      }
                      </span> 
                    </p>
                  </div>
                  `
                    )
                    .join("")}
                  <p style="text-decoration: underline; font-size: 24px; font-weight:bold"; margin-bottom: 5px;>
                    MB-Top Stock
                  </p>
                  ${Array.from({ length: 8 }, (_, index) =>
                    mbTopStock["coal" + (index + 1) + "name"] === undefined ||
                    mbTopStock["coal" + (index + 1) + "stock"] === 0
                      ? null
                      : `
                  <div style="margin: 10px;  flex-direction: row; ">
                    <p style=" display: flex; justify-content: space-between;">
                    <span style="font-size: 17px; font-weight:bold">
                      ${mbTopStock["coal" + (index + 1) + "name"].toUpperCase()}
                    </span>
                    <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        mbTopStock["coal" + (index + 1) + "stock"] === null
                          ? "000"
                          : mbTopStock["coal" + (index + 1) + "stock"]
                      }
                    </span>
                    </p>
                  </div>
                  `
                  ).join("")}
                  ${Array.from({ length: 8 }, (_, index) =>
                    mbTopStock["oldcoal" + (index + 1) + "name"] === "" ||
                    mbTopStock["oldcoal" + (index + 1) + "name"] ===
                      undefined ||
                    mbTopStock["oldcoal" + (index + 1) + "stock"] === 0
                      ? null
                      : `
                  <div style="margin: 10px;  flex-direction: row; ">
                    <p style=" display: flex; justify-content: space-between;">
                      <span style="font-size: 17px; font-weight:bold">
                      ${mbTopStock[
                        "oldcoal" + (index + 1) + "name"
                      ].toUpperCase()}
                      </span>
                      <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        mbTopStock["oldcoal" + (index + 1) + "stock"] === 0
                          ? "000"
                          : mbTopStock["oldcoal" + (index + 1) + "stock"]
                      }
                      </span>
                    </p>
                  </div>
                  `
                  ).join("")}
                  <p style="font-size: 24px; font-weight:bold">
                    Total 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    ${mbTopStock.total_stock}
                  </p>
                </div>

                <div style=" flex-direction:column;  display: inline-block;float: left; width:400px;float:left;  text-align:center;align-items:flex-start;margin-top:2px; margin-right:10px; margin-left:10px">
                <p style="text-decoration: underline; font-size: 24px; font-weight:bold"; margin-bottom: 5px;>CPP3 Reclaiming Data</p>  
                ${Array.from({ length: 1 }, (_, index) =>
                  reclaiming["cpp3coal" + (index + 1) + "name"] === undefined &&
                  reclaiming["cpp3coal" + (index + 1) + "recl"] === undefined
                    ? "No reclaiming ..."
                    : Array.from({ length: 6 }, (_, index) =>
                        reclaiming["cpp3coal" + (index + 1) + "name"] === "" &&
                        reclaiming["cpp3coal" + (index + 1) + "recl"] === 0
                          ? null
                          : `
                  <div style="margin: 10px;  flex-direction: row; ">
                    <p style=" display: flex; justify-content: space-between;">
                    <span style="font-size: 17px; font-weight:bold">
                      ${reclaiming[
                        "cpp3coal" + (index + 1) + "name"
                      ].toUpperCase()}
                    </span>
                    <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        reclaiming["cpp3coal" + (index + 1) + "recl"] === 0
                          ? "000"
                          : reclaiming["cpp3coal" + (index + 1) + "recl"]
                      }
                    </span>
                    </p>
                  </div>
                  `
                      ).join("")
                ).join("")}

                ${
                  reclaiming.cpp3total_reclaiming === undefined
                    ? null
                    : `<p style="font-size: 24px; font-weight:bold"> 
                  Total 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
                  ${reclaiming.cpp3total_reclaiming}
                 </p> `
                }
                  
                 
                  ${
                    reclaiming.cpp3total_reclaiming === undefined
                      ? null
                      : ["patha", "pathb"]
                          .map(
                            (item, index) =>
                              `
                    <div style="margin: 10px; flex-direction: row; ">
                      <p style=" display: flex; justify-content: space-between;"> 
                      <span style="font-size: 17px; font-weight:bold">${item.toUpperCase()}</span>
                      <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        reclaiming[item + "recl"] === 0
                          ? "000"
                          : reclaiming[item + "recl"]
                      }
                      </span> 
                      </p>
                    </div>
                    `
                          )
                          .join("")
                  }
                  <p style="text-decoration: underline; font-size: 24px; font-weight:bold"; margin-bottom: 5px;>
                   MB-Top Stock
                  </p>
                  ${Array.from({ length: 6 }, (_, index) =>
                    mbTopStock["cpp3coal" + (index + 1) + "name"] ===
                      undefined ||
                    mbTopStock["cpp3coal" + (index + 1) + "stock"] === 0
                      ? null
                      : `
                    <div style="margin: 10px;  flex-direction: row; ">
                      <p style=" display: flex; justify-content: space-between;">
                      <span style="font-size: 17px; font-weight:bold">
                      ${mbTopStock[
                        "cpp3coal" + (index + 1) + "name"
                      ].toUpperCase()}
                      </span>
                      <span style=" margin-left: 20px;font-size: 17px; font-weight:bold">
                      ${
                        mbTopStock["cpp3coal" + (index + 1) + "stock"] === null
                          ? "000"
                          : mbTopStock["cpp3coal" + (index + 1) + "stock"]
                      }
                      </span>
                      </p>
                    </div>
                    `
                  ).join("")}
                  <p style="font-size: 24px; font-weight:bold">
                   Total 
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   ${mbTopStock.cpp3total_stock}
                  </p>
                </div>
              </div>

              <div style= "display:flex; flex-direction:row; width:780px; height:930px;  margin-top:5px;border:2px solid black;align-self: center;margin-left:10px;margin-right:10px">
              <div style=" flex-direction:column;  display: inline-block;float: left; width:400px;float:left;  text-align:center;align-items:flex-start;margin-top:2px; margin-right:10px; margin-left:10px;border-right: 2px solid black;">
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>Feeding Data</p>             
               ${["ct1", "ct2", "ct3"]
                 .map(
                   (item, index) =>
                     `
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;"> 
                 <span style="font-size: 20px; font-weight:bold">
                   ${item.toUpperCase()}
                 </span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                   ${feeding[item] === 0 ? "000" : feeding[item]}
                 </span>
                 </p>
               </div>
               `
                 )
                 .join("")}

               <p style="font-size: 25px; font-weight:bold">
                 Total 
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 ${feeding.total_feeding}
               </p>
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                 Stream-wise Feeding
               </p>
               ${["stream1", "stream1A", "pathc"]
                 .map(
                   (item, index) =>
                     `
               <div style="margin: 10px; margin-top: 10px; flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;"> 
                   <span style="font-size: 20px; font-weight:bold">${item.toUpperCase()}</span>
                   <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                     ${
                       feeding[item] === 0 || undefined ? "0000" : feeding[item]
                     }
                   </span> 
                 </p>
               </div>
               `
                 )
                 .join("")}
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                 Coal-tower Stocks
               </p>
               ${["ct1", "ct2", "ct3"]
                 .map(
                   (item, index) =>
                     `
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;"> 
                   <span style="font-size: 20px; font-weight:bold">
                     ${item.toUpperCase()}
                   </span>
                   <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                     ${coalTowerStock[item + "stock"]}
                   </span>
                 </p>
               </div>
               `
                 )
                 .join("")}
               <p style="font-size: 25px; font-weight:bold">
                 Total 
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 ${coalTowerStock.total_stock}
               </p>
               
              
               </div>
               <div style=" flex-direction:column;  display: inline-block;float: left; width:400px;float:left;  text-align:center;align-items:flex-start;margin-top:2px; margin-right:10px; margin-left:10px">
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>Coal Analysis</p>
               ${["ci", "ash", "vm", "fc", "tm"]
                 .map(
                   (item, index) =>
                     `
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;">
                 <span style="font-size: 20px; font-weight:bold">${item.toUpperCase()}</span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                   ${
                     item === "ci"
                       ? coalAnalysis[item] + "%"
                       : coalAnalysis[item]
                   }
                 </span> 
                 </p>
               </div>
               `
                 )
                 .join("")}
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                 Blend Ratio
               </p>
               ${Array.from(
                 { length: blendCount },
                 (_, index) => `
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;">
                 <span style="font-size: 20px; font-weight:bold">
                 ${blend["cn" + (index + 1)].toUpperCase()}
                 </span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                 ${blend["cp" + (index + 1)] + "%"}
                 </span>
                 </p>
               </div>
               `
               ).join("")}
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                 Blend Start Date
               </p>
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;">
                 <span style="font-size: 20px; font-weight:bold">
                 ${FormatDate(new Date(blend.date))}
                 </span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                 ${blend.shift}
                 </span>
                 </p>
               </div>
               <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                 Auto group Feeding
               </p>
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;">
                 <span style="font-size: 20px; font-weight:bold">
                 Auto
                 </span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                 ${feeding.auto}
                 </span>
                 </p>
               </div>
               <div style="margin: 10px;  flex-direction: row; ">
                 <p style=" display: flex; justify-content: space-between;">
                 <span style="font-size: 20px; font-weight:bold">
                 Non-Auto
                 </span>
                 <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                 ${feeding.nonauto}
                 </span>
                 </p>
               </div>
               </div>
              </div>
     
              <div style= "display:flex; flex-direction:row; width:780px; height:930px;  margin-top:50px;border:2px solid black;align-self: center;margin-left:10px;margin-right:10px">
                <div style=" flex-direction:column;  display: inline-block; float: left; width:400px;float:left; border-right: 2px solid black; text-align:center;align-items:flex-start;margin-top:2px; margin-right:10px">
              <!--  <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>Pushing Schedule</p>
                ${[1, 2, 3, 4, 5]
                  .map(
                    (item, index) =>
                      `
                <div style="margin: 10px;  flex-direction: row; ">
                  <p style=" display: flex; justify-content: space-between;">
                  <span style="font-size: 20px; font-weight:bold">Battery-${item}</span>
                  <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                  ${pushingSchedule["bat" + item]}
                  </span> 
                  </p>
                </div>
                `
                  )
                  .join("")}
                <p style="font-size: 25px; font-weight:bold">
                  Total 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  ${pushingSchedule.total_pushings}
                </p> -->
                <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>
                  Running Hours
                </p>
                ${[2, 3, 4]
                  .map(
                    (item, index) =>
                      `
                <div style="margin: 10px;  flex-direction: row; ">
                  <p style=" display: flex; justify-content: space-between;">
                  <span style="font-size: 20px; font-weight:bold">Stream-${item}</span>
                  <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                  ${
                    runningHours["str" + item + "hrs"] +
                    " : " +
                    runningHours["str" + item + "min"]
                  }
                  </span>
                  </p> 
                </div>
                `
                  )
                  .join("")}
                </br>
                ${[50, 49, 126]
                  .map(
                    (item, index) =>
                      `
                <div style="margin: 10px;  flex-direction: row; ">
                  <p style=" display: flex; justify-content: space-between;">
                  <span style="font-size: 20px; font-weight:bold">CC-${item}</span>
                  <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                  ${
                    runningHours["cc" + item + "hrs"] +
                    " : " +
                    runningHours["cc" + item + "min"]
                  }
                  </span>
                  </p> 
                </div>
                `
                  )
                  .join("")}
                </div>
                <div style=" flex-direction:column;  display: inline-block;float: left; width:400px;float:left;  text-align:center;align-items:flex-start;margin-top:2px; margin-right:10px; margin-left:10px">
                <p style="text-decoration: underline; font-size: 25px; font-weight:bold"; margin-bottom: 10px;>Crusher Status</p>             
                ${["cr34", "cr35", "cr36", "cr37", "cr38"]
                  .map(
                    (item, index) =>
                      `
                    <div style="margin-bottom: 10px;  flex-direction: row; ">
                      <p style=" display: flex; justify-content: space-between;"> 
                        <span style="font-size: 20px; font-weight:bold">
                          ${item.toUpperCase()}
                        </span>
                        <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                          ${
                            crusherStatus[item + "status"] === ""
                              ? "N/A"
                              : crusherStatus[item + "status"]
                          }
                        </span>
                        <span style=" margin-left: 20px;font-size: 20px; font-weight:bold">
                          F-${
                            crusherStatus[item + "feeder"] === ""
                              ? "N/A"
                              : crusherStatus[item + "feeder"]
                          }
                        </span>
                      </p>
                    </div>
                    `
                  )
                  .join("")}
                </div>
              </div>

              <div style="display:flex; flex-direction: column; text-align:center; width: 800px; height:100px;margin-top:60px">
                <h1 style="text-decoration: underline;">CPP Shift Delays</h1>
              </div>
              <div style="display:flex; flex-direction:row; width:800px; height:900px; border:2px solid black; margin-top:10px">
                <div style=" flex-direction:row;height:900px;width:800px;float:left; border-bottom: 2px solid black; text-align:center;align-items:flex-start;">             
                  ${Array.from(
                    { length: shiftDelays.length },
                    (_, index) =>
                      `
                    <div style="margin-bottom: 10px; margin-top: 10px; flex-direction: row; ">
                      <span style="font-size: 20px; font-weight:bold">From   : ${shiftDelays[index]["fromTime"]}</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style="font-size: 20px; font-weight:bold">To     : ${shiftDelays[index]["toTime"]}</span>
                      <p style="font-size: 20px; font-weight:bold">Reason : ${shiftDelays[index]["reason"]}</p>
                    </div>
                    <hr class="custom-hr">
                  `
                  ).join("")}
                </div>       
              </div>
            </body>
          </html>
        `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Save the PDF to the file system
      const fileUri = `${FileSystem.documentDirectory}CPP_${selectedShift}shift_report.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("PDF Generated", `PDF has been saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while generating the PDF.");
    }
  };

  const requestStoragePermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("Permission status:", status);

      if (status === "granted") {
        console.log("Permission granted");
        return true;
      } else {
        console.log("Permission denied");
        Alert.alert(
          "Permission Denied!",
          "You need to give storage permission to download the file"
        );
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleGeneratePdf = async () => {
    const permissionGranted = await requestStoragePermission();
    if (permissionGranted) {
      generatePDF();
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDelAuthClose = () => {
    setDelAuthModelVisible(false);
  };

  const handleEditAuthClose = () => {
    setEditAuthModelVisible(false);
  };

  const handleClickDelete = () => {
    setDelAuthModelVisible(true);
  };

  const handleClickEdit = () => {
    setEditAuthModelVisible(true);
  };

  const handleDelAuthModelSubmit = async (empnum) => {
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          setCredentials(responce.data.data[0]);
          //console.log(credentials);
          //navigation.navigate("ShiftReportView");
          handleDeleteReport();
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
  };

  const handleEditAuthModelSubmit = async (empnum) => {
    await axios
      .get(BaseUrl + "/employedetails", {
        params: {
          empnum: empnum,
        },
      })
      .then((responce) => {
        if (responce.data.data[0]) {
          setCredentials(responce.data.data[0]);
          setGlobalDate(selectedDate);
          setGlobalShift(selectedShift);
          setReclaimingData(reclaiming);
          setFeedingData(feeding);
          setRunningHoursData(runningHours);
          setMbTopStockData(mbTopStock);
          setCoalTowerStockData(coalTowerStock);
          setCoalAnalysisData(coalAnalysis);
          setPushingScheduleData(pushingSchedule);
          setAllCrushersData(crusherStatus);
          setShiftDelaysData(shiftDelays);
          navigation.navigate("EditShiftReport");
        } else alert("Wrong Employee Number..");
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = () => {
    setClickSubmit(true);
    let date = selectedDate.toISOString().split("T")[0];
    if (selectedShift === "" || selectedShift === "Select") {
      alert("Select Shift..");
      return;
    }
    let shift = selectedShift;
    getShiftReportPersonDetails(date, shift);
    getBlend(date, shift);
    getReclaimingData(date, shift);
    getfeedingdata(date, shift);
    getCoalTowerStock(date, shift);
    getMbTopCoalData(date, shift);
    getRunningHoursdata(date, shift);
    getShiftDelayData(date, shift);
    getCoalAnalysisData(date, shift);
    getPushingScheduleData(date, shift);
    getCrusherStatusData(date, shift);
    setLoadCard(true);
  };

  const getShiftReportPersonDetails = async (date, shift) => {
    await axios
      .get(BaseUrl + "/shiftreportenteredby", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => {
        setShiftReportEnteredBy(responce.data.data[0]);
      })
      .catch((error) => console.log(error));
  };

  const getBlend = async (date, shift) => {
    await axios
      .get(BaseUrl + "/blend", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((response) => {
        setBlend(response.data.data[0]);
        setBlendCount(response.data.data[0].total);
      })
      .catch((error) => console.log(error));
  };

  const getReclaimingData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/reclaiming", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setReclaiming(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getfeedingdata = async (date, shift) => {
    await axios
      .get(BaseUrl + "/feeding", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setFeeding(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getCoalTowerStock = async (date, shift) => {
    await axios
      .get(BaseUrl + "/coaltowerstock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setCoalTowerStock(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getMbTopCoalData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/mbtopStock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setMbTopStock(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getRunningHoursdata = async (date, shift) => {
    await axios
      .get(BaseUrl + "/runningHours", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setRunningHours(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getShiftDelayData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/shiftDelay", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setShiftDelays(responce.data.data))
      .catch((error) => console.log(error));
  };

  const getCoalAnalysisData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/coalAnalysis", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setCoalAnalysis(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getPushingScheduleData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/pushings", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setPushingSchedule(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const getCrusherStatusData = async (date, shift) => {
    await axios
      .get(BaseUrl + "/crusher", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => setCrusherStatus(responce.data.data[0]))
      .catch((error) => console.log(error));
  };

  const handleDeleteReport = () => {
    let date = selectedDate.toISOString().split("T")[0];
    let shift = selectedShift;
    try {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this shift record?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              // Your delete logic here
              setProgress(0);
              setDoneScreen(true);

              delReclaimingData(date, shift);
              setProgress(0.1);
              delfeedingdata(date, shift);
              setProgress(0.2);
              delCoalTowerStock(date, shift);
              setProgress(0.3);
              delMbTopCoalData(date, shift);
              setProgress(0.4);
              delRunningHoursdata(date, shift);
              setProgress(0.5);
              delShiftDelayData(date, shift);
              setProgress(0.6);
              delCoalAnalysisData(date, shift);
              setProgress(0.7);
              delPushingScheduleData(date, shift);
              setProgress(0.8);
              delCrusherStatusData(date, shift);
              delShiftReportPersonDetails(date, shift);
              setProgress(1);
              console.log("Shift record deleted");

              setTimeout(() => {
                navigation.navigate("ViewReports");
              }, 1000);
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.log("Error while delete shift report: ", error);
    }
  };

  const delShiftReportPersonDetails = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/shiftreportenteredby", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delReclaimingData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/reclaiming", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delfeedingdata = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/feeding", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delCoalTowerStock = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/coaltowerstock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delMbTopCoalData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/mbtopStock", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delRunningHoursdata = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/runningHours", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delShiftDelayData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/shiftDelay", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delCoalAnalysisData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/coalAnalysis", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delPushingScheduleData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/pushings", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  const delCrusherStatusData = async (date, shift) => {
    await axios
      .delete(BaseUrl + "/crusher", {
        params: {
          date: date,
          shift: shift,
        },
      })
      .then((responce) => console.log(responce.status))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <DoneScreen
        progress={progress}
        onDone={() => setDoneScreen(false)}
        visible={doneScreen}
      />
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
              Shift Report View
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
              gap: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp(2),
                alignItems: "center",
                height: hp(5),
                width: wp(45),
              }}
            >
              <Button
                title="Select date"
                buttonStyle={{ width: wp(23), height: hp(5) }}
                titleStyle={{
                  fontSize: hp(1.6),
                  color: "white",
                  borderBottomWidth: 2,
                  borderBottomColor: "white",
                }}
                radius={25}
                onPress={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}
              <Text style={{ fontSize: hp(2), color: "red" }}>
                {selectedDate.toISOString().split("T")[0]}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: wp(1),
                alignItems: "center",
                height: hp(5),
                width: wp(50),
              }}
            >
              <View
                style={{
                  height: hp(5),
                  width: wp(20),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#6495ED",
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: hp(1.5),
                    alignSelf: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Select Shift
                </Text>
              </View>
              <Picker
                id="Shift"
                style={{
                  width: wp(25),
                }}
                mode="dropdown"
                enabled={true}
                onValueChange={(shift) => setSelectedShift(shift)}
                selectedValue={selectedShift}
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
            disabled={!loadLatestRecord}
          />
        </View>
        {shiftReportEnteredBy && latestRecord && !clickSubmit && !loadCard && (
          <View
            style={{
              height: hp(20),
              width: wp(100),

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: hp(3) }}>Last Record uploaded on..</Text>
            <Text style={{ fontSize: hp(3) }}>
              {FormatDate(new Date(latestRecord.date))}
            </Text>
            <Text style={{ fontSize: hp(3) }}>{latestRecord.shift}</Text>
          </View>
        )}
        <ScrollView>
          {shiftReportEnteredBy &&
          loadCard &&
          reclaiming &&
          mbTopStock &&
          coalCount > 0 ? (
            <View style={{ marginTop: hp(1), marginBottom: hp(2) }}>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  <Text style={{ fontSize: hp(3) }}>
                    {shiftReportEnteredBy.name} -
                  </Text>
                  <Text style={{ fontSize: hp(3) }}>
                    {shiftReportEnteredBy.empnum}
                  </Text>
                </Card.Title>
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Reclaiming
                </Card.Title>
                <Card.Divider />
                {reclaiming && mbTopStock && coalCount > 0 && (
                  <View>
                    {Array.from({ length: coalCount }, (_, index) =>
                      reclaiming["coal" + (index + 1) + "name"] === "" &&
                      reclaiming["coal" + (index + 1) + "recl"] === 0 ? null : (
                        <View
                          key={index}
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: wp(6),
                            gap: hp(3),
                          }}
                        >
                          <View
                            style={{
                              width: wp(30),

                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {reclaiming[
                                "coal" + (index + 1) + "name"
                              ].toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {reclaiming["coal" + (index + 1) + "recl"] === "0"
                              ? "000"
                              : reclaiming["coal" + (index + 1) + "recl"]}
                          </Text>
                        </View>
                      )
                    )}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                      reclaiming["excoal" + item + "name"] === "" &&
                      reclaiming["excoal" + item + "recl"] === 0 ? null : (
                        <View
                          key={index}
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: wp(6),
                            gap: hp(3),
                          }}
                        >
                          <View
                            style={{
                              width: wp(30),

                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {reclaiming[
                                "excoal" + item + "name"
                              ].toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {reclaiming["excoal" + item + "recl"] === "0"
                              ? "000"
                              : reclaiming["excoal" + item + "recl"]}
                          </Text>
                        </View>
                      )
                    )}
                    <Card.Divider />
                    {["cc49", "cc50", "cc126"].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(6),
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
                          {reclaiming[item + "recl"] === 0
                            ? "000"
                            : reclaiming[item + "recl"]}
                        </Text>
                      </View>
                    ))}
                    <Card.Divider />
                    <View>
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(1),
                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(44),

                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.8),
                              fontWeight: "bold",
                            }}
                          >
                            Total Reclaiming
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
                            {reclaiming["total_reclaiming"]}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider />
                      <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                        MB Top Coal Stock
                      </Card.Title>
                      <Card.Divider />
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                        mbTopStock["coal" + item + "name"] === undefined ||
                        mbTopStock["coal" + item + "stock"] === null ? null : (
                          <View
                            key={index}
                            style={{
                              marginBottom: 10,
                              display: "flex",
                              flexDirection: "row",
                              marginLeft: wp(6),
                              gap: hp(3),
                            }}
                          >
                            <View
                              style={{
                                width: wp(30),

                                alignItems: "flex-end",
                              }}
                            >
                              <Text
                                style={{ fontSize: wp(5), fontWeight: "bold" }}
                              >
                                {mbTopStock[
                                  "coal" + item + "name"
                                ].toUpperCase()}
                              </Text>
                            </View>
                            <Divider orientation="vertical" />
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {mbTopStock["coal" + item + "stock"] === "null"
                                ? "000"
                                : mbTopStock["coal" + item + "stock"]}
                            </Text>
                          </View>
                        )
                      )}

                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                        mbTopStock["oldcoal" + item + "name"] === "" ||
                        mbTopStock["oldcoal" + item + "name"] === undefined ||
                        mbTopStock["oldcoal" + item + "stock"] === 0 ? null : (
                          <View
                            key={index}
                            style={{
                              marginBottom: 10,
                              display: "flex",
                              flexDirection: "row",
                              marginLeft: wp(6),
                              gap: hp(3),
                            }}
                          >
                            <View
                              style={{
                                width: wp(30),

                                alignItems: "flex-end",
                              }}
                            >
                              <Text
                                style={{ fontSize: wp(5), fontWeight: "bold" }}
                              >
                                {mbTopStock[
                                  "oldcoal" + item + "name"
                                ].toUpperCase()}
                              </Text>
                            </View>
                            <Divider orientation="vertical" />
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {mbTopStock["oldcoal" + item + "stock"] === "null"
                                ? "000"
                                : mbTopStock["oldcoal" + item + "stock"]}
                            </Text>
                          </View>
                        )
                      )}
                      <Card.Divider />
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(1),
                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(44),

                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.9),
                              fontWeight: "bold",

                              color: "red",
                            }}
                          >
                            Total MB Stock
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(6),
                              fontWeight: "bold",
                              color: "red",
                            }}
                          >
                            {mbTopStock["total_stock"]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </Card>

              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  CPP3 Reclaiming
                </Card.Title>
                <Card.Divider />
                {reclaiming && mbTopStock && (
                  <View>
                    {Array.from({ length: 6 }, (_, index) =>
                      (reclaiming["cpp3coal" + (index + 1) + "name"] === "" ||
                        reclaiming["cpp3coal" + (index + 1) + "name"] ===
                          undefined) &&
                      (reclaiming["cpp3coal" + (index + 1) + "recl"] === 0 ||
                        reclaiming["cpp3coal" + (index + 1) + "recl"] ===
                          undefined) ? null : (
                        <View
                          key={index}
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: wp(6),
                            gap: hp(3),
                          }}
                        >
                          <View
                            style={{
                              width: wp(30),

                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {reclaiming[
                                "cpp3coal" + (index + 1) + "name"
                              ].toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {reclaiming["cpp3coal" + (index + 1) + "recl"] ===
                            "0"
                              ? "000"
                              : reclaiming["cpp3coal" + (index + 1) + "recl"]}
                          </Text>
                        </View>
                      )
                    )}

                    <Card.Divider />
                    {["patha", "pathb"].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(6),
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
                          {reclaiming[item + "recl"] === 0 || undefined
                            ? "000"
                            : reclaiming[item + "recl"]}
                        </Text>
                      </View>
                    ))}
                    <Card.Divider />
                    <View>
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(1),
                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(44),

                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.8),
                              fontWeight: "bold",
                            }}
                          >
                            Total Reclaiming
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
                            {reclaiming["cpp3total_reclaiming"] === undefined
                              ? null
                              : reclaiming["cpp3total_reclaiming"]}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider />
                      <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                        CPP3 MB-Top Stock
                      </Card.Title>
                      <Card.Divider />
                      {[1, 2, 3, 4, 5, 6].map((item, index) =>
                        mbTopStock["cpp3coal" + item + "name"] === "" ||
                        mbTopStock["cpp3coal" + item + "name"] === undefined ||
                        mbTopStock["cpp3coal" + item + "stock"] === 0 ? null : (
                          <View
                            key={index}
                            style={{
                              marginBottom: 10,
                              display: "flex",
                              flexDirection: "row",
                              marginLeft: wp(6),
                              gap: hp(3),
                            }}
                          >
                            <View
                              style={{
                                width: wp(30),

                                alignItems: "flex-end",
                              }}
                            >
                              <Text
                                style={{ fontSize: wp(5), fontWeight: "bold" }}
                              >
                                {mbTopStock[
                                  "cpp3coal" + item + "name"
                                ].toUpperCase()}
                              </Text>
                            </View>
                            <Divider orientation="vertical" />
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {mbTopStock["cpp3coal" + item + "stock"] ===
                              "null"
                                ? "000"
                                : mbTopStock["cpp3coal" + item + "stock"]}
                            </Text>
                          </View>
                        )
                      )}

                      <Card.Divider />
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(1),
                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(44),

                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.9),
                              fontWeight: "bold",

                              color: "red",
                            }}
                          >
                            Total MB Stock
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(6),
                              fontWeight: "bold",
                              color: "red",
                            }}
                          >
                            {mbTopStock["cpp3total_stock"]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </Card>

              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Feeding
                </Card.Title>
                <Card.Divider />
                {feeding && coalTowerStock && (
                  <View style={{ marginTop: 10 }}>
                    {["ct1", "ct2", "ct3"].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(8),
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
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {feeding[item] === 0 ? "000" : feeding[item]}
                          </Text>
                        </View>
                      </View>
                    ))}
                    <Card.Divider />
                    {["stream1", "stream1A", "pathc"].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(8),
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
                          {feeding[item] === 0 || undefined
                            ? "0000"
                            : feeding[item]}
                        </Text>
                      </View>
                    ))}
                    <Card.Divider />
                    <View>
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",

                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(38),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.9),
                              fontWeight: "bold",
                              marginRight: wp(-1),
                            }}
                          >
                            Total Feeding
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
                            {feeding["total_feeding"]}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider />
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",

                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(38),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.9),
                              fontWeight: "bold",
                              marginRight: wp(-1),
                            }}
                          >
                            Auto Feeding
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
                            {feeding["auto"]}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider />
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",

                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(38),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(4.5),
                              fontWeight: "bold",
                              marginRight: wp(-1),
                            }}
                          >
                            Non-Auto Feeding
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text style={{ fontSize: wp(6), fontWeight: "bold" }}>
                            {feeding["nonauto"]}
                          </Text>
                        </View>
                      </View>
                      <Card.Divider />
                      <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                        Coal Tower Stock
                      </Card.Title>
                      <Card.Divider />
                      {["ct1", "ct2", "ct3"].map((item, index) => (
                        <View
                          key={index}
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            flexDirection: "row",
                            marginLeft: wp(8),
                            gap: hp(3),
                          }}
                        >
                          <View
                            style={{
                              width: wp(30),
                              alignItems: "flex-end",
                            }}
                          >
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {item.toUpperCase()}
                            </Text>
                          </View>
                          <Divider orientation="vertical" />
                          <View
                            style={{
                              width: wp(25),
                            }}
                          >
                            <Text
                              style={{ fontSize: wp(5), fontWeight: "bold" }}
                            >
                              {coalTowerStock[item] === 0
                                ? "000"
                                : coalTowerStock[item + "stock"]}
                            </Text>
                          </View>
                        </View>
                      ))}
                      <Card.Divider />
                      <View
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",

                          gap: hp(3),
                        }}
                      >
                        <View
                          style={{
                            width: wp(38),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(5.9),
                              fontWeight: "bold",
                              marginRight: wp(-1),
                              color: "red",
                            }}
                          >
                            Total CT Stock
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(25),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(6),
                              fontWeight: "bold",
                              color: "red",
                            }}
                          >
                            {coalTowerStock["total_stock"]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Running Hours
                </Card.Title>
                <Card.Divider />
                {runningHours && (
                  <View style={{ marginTop: 10 }}>
                    {[2, 3, 4].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(8),
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
                            Stream-{item}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                          {runningHours["str" + item + "hrs"]}:
                          {runningHours["str" + item + "min"]}
                        </Text>
                      </View>
                    ))}
                    <Card.Divider />
                    {[49, 50, 126].map((item, index) => (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: wp(8),
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
                            CC-{item}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                          {runningHours["cc" + item + "hrs"]}:
                          {runningHours["cc" + item + "min"]}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Shift Delays
                </Card.Title>
                <Card.Divider />
                {shiftDelays && (
                  <View style={{ marginTop: 10 }}>
                    {shiftDelays.map((item, index) => (
                      <View key={index}>
                        <View
                          style={{
                            alignSelf: "center",
                            marginBottom: 20,
                          }}
                        >
                          <Text
                            h4
                            h4Style={{ textDecorationLine: "underline" }}
                          >
                            Delay - {item.delayNumber}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            From :
                          </Text>
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {item.fromTime}
                          </Text>
                          <Divider orientation="vertical" />
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            To :
                          </Text>
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {item.toTime}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginTop: 20,
                            width: wp(85),
                            marginBottom: 20,
                          }}
                        >
                          <Text style={{ fontSize: wp(5) }}>
                            <Text
                              style={{
                                textDecorationLine: "underline",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Reason
                            </Text>
                            : {item.reason}
                          </Text>
                        </View>
                        <Card.Divider />
                      </View>
                    ))}
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Coal Analysis
                </Card.Title>
                <Card.Divider />
                {coalAnalysis && (
                  <View style={{ marginTop: 10 }}>
                    {["ci", "ash", "vm", "fc", "tm"].map((item, index) => (
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
                          {item === "ci"
                            ? coalAnalysis[item] + "%"
                            : coalAnalysis[item]}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Pushing Schedule
                </Card.Title>
                <Card.Divider />
                {pushingSchedule && (
                  <View style={{ marginTop: 10 }}>
                    {[1, 2, 3, 4, 5].map((item, index) => (
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
                            width: wp(30),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            Battery-{item}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                          {pushingSchedule["bat" + item]}
                        </Text>
                      </View>
                    ))}
                    <Card.Divider />
                    <View
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
                          marginRight: wp(5),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(5.9),
                            fontWeight: "bold",
                            marginRight: wp(-1),
                            color: "red",
                          }}
                        >
                          Total
                        </Text>
                      </View>
                      <Divider orientation="vertical" />
                      <View
                        style={{
                          width: wp(25),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(6),
                            fontWeight: "bold",
                            color: "red",
                          }}
                        >
                          {pushingSchedule["total_pushings"]}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Crusher Status
                </Card.Title>
                <Card.Divider />
                {crusherStatus && (
                  <View style={{ marginTop: 10 }}>
                    {[34, 35, 36, 37, 38].map((item, index) => (
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
                            width: wp(20),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            Cr-{item}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(20),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {crusherStatus["cr" + item + "status"]}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <View
                          style={{
                            width: wp(10),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            F-{crusherStatus["cr" + item + "feeder"]}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
              <Card>
                <Card.Title h3 h3Style={{ color: "#6495ED" }}>
                  Blend
                </Card.Title>
                <Card.Divider />
                {blend && blendCount > 0 && (
                  <View style={{ marginTop: 10 }}>
                    {Array.from({ length: blendCount }, (_, index) => (
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
                            width: wp(30),
                            alignItems: "flex-end",
                          }}
                        >
                          <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                            {blend["cn" + (index + 1)]}
                          </Text>
                        </View>
                        <Divider orientation="vertical" />
                        <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>
                          {blend["cp" + (index + 1)]}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
              <View>
                <Button
                  title="Generate PDF"
                  buttonStyle={{
                    width: wp(50),
                    borderRadius: 25,
                    alignSelf: "center",
                    margin: 10,
                  }}
                  onPress={handleGeneratePdf}
                />
              </View>
              <View>
                <Button
                  title="Edit Report"
                  buttonStyle={{
                    width: wp(50),
                    borderRadius: 25,
                    alignSelf: "center",
                    margin: 10,
                    backgroundColor: "green",
                  }}
                  onPress={handleClickEdit}
                />
              </View>
              <EditShiftReportAuthentication
                onClose={handleEditAuthClose}
                visible={editAuthModelVisible}
                onSubmit={handleEditAuthModelSubmit}
              />
              <View>
                <Button
                  title="Delete Report"
                  buttonStyle={{
                    width: wp(50),
                    borderRadius: 25,
                    alignSelf: "center",
                    margin: 10,
                    backgroundColor: "red",
                  }}
                  onPress={handleClickDelete}
                />
              </View>
              <DeleteShiftReportAuthentication
                onClose={handleDelAuthClose}
                visible={delAuthModelVisible}
                onSubmit={handleDelAuthModelSubmit}
              />
            </View>
          ) : (
            clickSubmit && (
              <View
                style={{
                  width: wp(100),
                  height: hp(20),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <>
                  <Text
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: hp(4),
                    }}
                  >
                    No Data Available...
                  </Text>
                  <Text style={{ fontSize: hp(3) }}>Data available upto..</Text>
                  <Text style={{ fontSize: hp(3) }}>
                    {FormatDate(new Date(latestRecord.date))}
                  </Text>
                  <Text style={{ fontSize: hp(3) }}>{latestRecord.shift}</Text>
                </>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </>
  );
}
