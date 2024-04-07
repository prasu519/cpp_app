import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Home from "../screens/Home";

import ShiftReportEntry from "../screens/ShiftReportEntry";
import EnterReclaiming from "../screens/EnterReclaiming";
import EnterFeeding from "../screens/EnterFeeding";
import EnterRunningHours from "../screens/EnterRunningHours";
import Review from "../screens/Review";
import AddBlend from "../screens/AddBlend";
import AppBlendTextBox from "../components/AppBlendTextBox";
import DoneScreen from "../screens/DoneScreen";
import EnterDelays from "../screens/EnterDelays";
import BinStock from "../screens/BinStock";

const stack = createNativeStackNavigator();

function AppNavigator(props) {
  return (
    <stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <stack.Screen name="Home" component={Home} />
      <stack.Screen name="DoneScreen" component={DoneScreen} />
      <stack.Screen name="ShiftReportEntry" component={ShiftReportEntry} />
      <stack.Screen name="EnterReclaiming" component={EnterReclaiming} />
      <stack.Screen name="EnterFeeding" component={EnterFeeding} />
      <stack.Screen name="EnterRunningHours" component={EnterRunningHours} />
      <stack.Screen name="EnterDelays" component={EnterDelays} />
      <stack.Screen name="Review" component={Review} />
      <stack.Screen name="AddBlend" component={AddBlend} />
      <stack.Screen name="BinStock" component={BinStock} />
    </stack.Navigator>
  );
}

export default AppNavigator;
