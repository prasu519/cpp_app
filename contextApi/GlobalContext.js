import React, { createContext, useState } from "react";

// Create the context
export const GlobalContext = createContext();

// Create the provider component
export const GlobalProvider = ({ children }) => {
  const [credentials, setCredentials] = useState({ name: "", empnum: "" });
  const [reclaimingData, setReclaimingData] = useState();
  const [feedingData, setFeedingData] = useState();
  const [runningHoursData, setRunningHoursData] = useState();
  const [shiftDelaysData, setShiftDelaysData] = useState();
  const [mbTopStockData, setMbTopStockData] = useState();
  const [coalTowerStockData, setCoalTowerStockData] = useState();
  const [coalAnalysisData, setCoalAnalysisData] = useState();
  const [pushingScheduleData, setPushingScheduleData] = useState();

  return (
    <GlobalContext.Provider
      value={{
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
