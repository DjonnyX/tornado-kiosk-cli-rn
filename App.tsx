import React, { useState } from 'react';
import {
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigationStack } from './src/components/navigation/MainNavigationStack';
import { DataCollectorService } from './src/core';
import { ICompiledData } from '@djonnyx/tornado-types';
import { Provider } from 'react-redux';
import { store } from './src/store';

const App = () => {
  const [combinedData, setData] = useState<ICompiledData | null>(null);

  const setCombinedData = (data: ICompiledData) => {
    setData(prevData => data);
  }

  return (
    <>
      <Provider store={store}>
        {/** services */}
        <DataCollectorService />

        {/** components */}
        <StatusBar hidden={true} />
        <NavigationContainer>
          <MainNavigationStack />
        </NavigationContainer>
      </Provider>
    </>
  );
};

export default App;
