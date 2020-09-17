import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigationStack } from './src/components/navigation/MainNavigationStack';
import { DataCollector } from './src/core';

const App = () => {
  return (
    <>
      <DataCollector />
      <StatusBar hidden={true} />
      <NavigationContainer>
        <MainNavigationStack />
      </NavigationContainer>
    </>
  );
};

export default App;
