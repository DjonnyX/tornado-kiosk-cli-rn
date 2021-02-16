import React from "react";
import {
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { MainNavigationStack } from "./src/components/navigation/MainNavigationStack";
import { SnackService, AlertService, AuthService, DataCollectorService, NavigationService, OrderService, UserIdleService } from "./src/core";
import { store } from "./src/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        {/** services */}
        <OrderService />
        <AuthService />
        <DataCollectorService />
        <NavigationService />
        <AlertService />

        {/** components */}
        <UserIdleService>
          <StatusBar hidden={true} />
          <NavigationContainer>
            <MainNavigationStack />
          </NavigationContainer>
        </UserIdleService>
        {/** snack */}
        <SnackService />
      </Provider>
    </>
  );
};

export default App;
