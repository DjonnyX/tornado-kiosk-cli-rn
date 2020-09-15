import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigationStack } from './src/components/navigation/MainNavigationStack';

const App = () => {
  return (
    <>
      <StatusBar hidden={true} />
      <NavigationContainer>
        <MainNavigationStack />
      </NavigationContainer>
    </>
  );
};

export default App;
