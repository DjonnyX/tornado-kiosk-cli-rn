import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Button, Text, ProgressBarAndroid } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";

interface ILoadingSelfProps {
  // store props
  _progress: number;
  _loaded: boolean;

  // self props
}

interface ILoadingProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, ILoadingSelfProps { }

const LoadingScreenContainer = ({ _progress, _loaded, navigation }: ILoadingProps) => {
  if (_loaded) {
    navigation.navigate(MainNavigationScreenTypes.INTRO);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ProgressBarAndroid progress={_progress}></ProgressBarAndroid>
      <Text>
        {
          `${_progress}%`
        }
      </Text>
    </View>
  );
}

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  const _progress = Math.ceil(state.combinedData?.progress.total === 0 ? 0 : ((state.combinedData?.progress.current || 0) / state.combinedData?.progress.total) * 100);
  const _loaded = !!state.combinedData.data;
  return {
    _progress,
    _loaded,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    /*_onChange: (data: ICompiledData) => {
        dispatch(CombinedDataActions.setData(data));
    }*/
  };
};

export const LoadingScreen = connect(mapStateToProps, null)(LoadingScreenContainer);