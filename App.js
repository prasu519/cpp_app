import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./routes/AppNavigator";
import { GlobalProvider } from "./contextApi/GlobalContext";

const App = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
