import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./routes/AppNavigator";
import { GlobalProvider } from "./contextApi/GlobalContext";

const App = () => {
  return (
    <GlobalProvider>
      <StatusBar barStyle="light-content" hidden={false} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
