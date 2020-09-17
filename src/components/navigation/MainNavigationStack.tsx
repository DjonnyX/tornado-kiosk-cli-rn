import React from "react";
import {
  createStackNavigator,
} from '@react-navigation/stack';

import { LoadingScreen } from '../screens/LoadingScreen';

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
        options={{
          title: 'Awesome app',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={LoadingScreen}
        options={{
          title: 'My profile',
        }}
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