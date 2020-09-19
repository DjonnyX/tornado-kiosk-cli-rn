import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Button, Text, ProgressBarAndroid } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";

interface ILoadingSelfProps {
  
}

interface ILoadingProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, ILoadingSelfProps { }

const LoadingScreenContainer = ({ navigation }: ILoadingProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ProgressBarAndroid progress={50}></ProgressBarAndroid>
      <Text>Loading screen</Text>
      <Button
        title="Go to Profile 2"
        onPress={() => navigation.navigate(MainNavigationScreenTypes.INTRO)}
      />
    </View>
  );
}

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  console.log("state", state)
  return {
    ads: (state.combinedData?.data?.refs as any)?.assets[55].path,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    /*_onChange: (data: ICompiledData) => {
        dispatch(CombinedDataActions.setData(data));
    }*/
  };
};

export const LoadingScreen = connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);