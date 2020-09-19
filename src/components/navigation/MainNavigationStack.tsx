import React from "react";
import {
  createStackNavigator,
} from '@react-navigation/stack';

import { LoadingScreen } from '../screens/LoadingScreen';
import { IntroScreen } from "../screens/IntroScreen";
import { MainNavigationScreenTypes } from "./MainNavigationScreenTypes";

const Stack = createStackNavigator();

export const MainNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={MainNavigationScreenTypes.INTRO}
      headerMode="none"
      screenOptions={{}}
    >
      <Stack.Screen
        name={MainNavigationScreenTypes.LOADING}
        component={LoadingScreen}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.INTRO}
        component={IntroScreen}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.MENU}
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={MainNavigationScreenTypes.MY_ORDER}
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}