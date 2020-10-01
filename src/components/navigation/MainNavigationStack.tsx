import React from "react";
import {
  createStackNavigator,
} from "@react-navigation/stack";

import { LoadingScreen } from "../screens/LoadingScreen";
import { IntroScreen } from "../screens/IntroScreen";
import { MainNavigationScreenTypes } from "./MainNavigationScreenTypes";
import { MenuScreen } from "../screens/MenuScreen";
import { ConfirmationOrderScreen } from "../screens/ConfirmationOrderScreen";

const Stack = createStackNavigator();

export const MainNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainNavigationScreenTypes.LOADING}
      headerMode="none"
      screenOptions={{}}
    >
      <Stack.Screen
        name={MainNavigationScreenTypes.LOADING}
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.INTRO}
        component={IntroScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.MENU}
        component={MenuScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.CONFIRMATION_ORDER}
        component={ConfirmationOrderScreen}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}