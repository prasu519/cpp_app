import { View, Text } from "react-native";
import React, { useContext } from "react";
import { GlobalContext } from "../contextApi/GlobalContext";

export default function UploadToDatabase() {
  const {
    reclaimingData,
    feedingData,
    ningHoursData,
    shiftDelaysData,
    mbTopStockData,
    coalTowerStockData,
    coalAnalysisData,
    pushingScheduleData,
  } = useContext(GlobalContext);
  return (
    <View>
      <Text>UploadToDatabase</Text>
    </View>
  );
}
