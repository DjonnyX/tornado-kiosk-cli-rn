import React from 'react';
import {
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigationStack } from './src/components/navigation/MainNavigationStack';
import { dataCollectorService } from './src/services';

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

dataCollectorService.run();

export default App;
