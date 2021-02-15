import React, { useState } from "react";
import {
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { MainNavigationStack } from "./src/components/navigation/MainNavigationStack";
import { AlertService, AuthService, DataCollectorService, NavigationService, OrderService, UserIdleService } from "./src/core";
import { store } from "./src/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        {/** services */}
        <AlertService />
        <AuthService />
        <DataCollectorService />
        <OrderService />
        <NavigationService />

        {/** components */}
        <UserIdleService>
          <StatusBar hidden={true} />
          <NavigationContainer>
            <MainNavigationStack />
          </NavigationContainer>
        </UserIdleService>
      </Provider>
    </>
  );
};

export default App;
