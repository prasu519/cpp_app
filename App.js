import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./routes/AppNavigator";
import { GlobalProvider } from "./contextApi/GlobalContext";

const App = () => {
  return (
    <GlobalProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#40E0D0",
        }}
      >
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </GlobalProvider>
  );
};

export default App;
