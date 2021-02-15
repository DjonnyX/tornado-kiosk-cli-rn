import React, { useState } from "react";
import {
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { MainNavigationStack } from "./src/components/navigation/MainNavigationStack";
import { AuthService, DataCollectorService, UserIdleService } from "./src/core";
import { store } from "./src/store";
import { AlertService } from "./src/core/AlertService";
import { OrderService } from "./src/core/OrderService";

const App = () => {
  return (
    <>
      <Provider store={store}>
        {/** services */}
        <AlertService />
        <AuthService />
        <DataCollectorService />
        <OrderService />

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
