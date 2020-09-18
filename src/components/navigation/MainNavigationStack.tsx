import React from "react";
import {
  createStackNavigator,
} from '@react-navigation/stack';

import { LoadingScreen } from '../screens/LoadingScreen';
import { AdScreen } from "../screens/IntroScreen";

const Stack = createStackNavigator();

export const MainNavigationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      headerMode="none"
      screenOptions={{}}
    >
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
      />
      <Stack.Screen
        name="Ad"
        component={AdScreen}
      />
      <Stack.Screen
        name="Settings"
        component={LoadingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}