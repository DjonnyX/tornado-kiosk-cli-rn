import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CombinedDataSelectors } from "../../store/selectors";

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
      <ProgressBar style={{ width: '100%', maxWidth: 200, marginLeft: '10%', marginRight: '10%' }} styleAttr="Horizontal" progress={_progress / 100} indeterminate={false}></ProgressBar>
      <Text>
        {
          `${_progress}%`
        }
      </Text>
    </View>
  );
}

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  return {
    _progress: CombinedDataSelectors.selectProgress(state),
    _loaded: CombinedDataSelectors.selectLoaded(state),
  };
};

export const LoadingScreen = connect(mapStateToProps, null)(LoadingScreenContainer);