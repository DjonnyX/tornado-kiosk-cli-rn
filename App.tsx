import React, { useCallback, useRef, useState } from "react";
import {
  StatusBar,
} from "react-native";
import { NavigationContainer, NavigationContainerRef, NavigationState } from "@react-navigation/native";
import { Provider } from "react-redux";
import { MainNavigationStack } from "./src/components/navigation/MainNavigationStack";
import { SnackService, AlertService, AuthService, DataCollectorService, NavigationService, OrderService, UserIdleService } from "./src/core";
import { store } from "./src/store";
import { MainNavigationScreenTypes } from "./src/components/navigation";
import { Main } from "./src/components/Main";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <Main/>
      </Provider>
    </>
  );
};

export default App;
