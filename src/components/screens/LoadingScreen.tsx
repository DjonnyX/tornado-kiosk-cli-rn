import React, { Dispatch, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CombinedDataSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";

interface ILoadingSelfProps {
  // store props
  _progress: number;
  _loaded: boolean;

  // self props
}

interface ILoadingProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, ILoadingSelfProps { }

const LoadingScreenContainer = React.memo(({ _progress, _loaded, navigation }: ILoadingProps) => {
  useEffect(() => {
    if (_loaded) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: MainNavigationScreenTypes.INTRO },
            ],
          })
        );
      });
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ProgressBar style={{ width: "100%", maxWidth: 200, marginLeft: "10%", marginRight: "10%" }} styleAttr="Horizontal" progress={_progress / 100} indeterminate={false}></ProgressBar>
      <Text>
        {
          _progress > 0
            ?
            `${_progress}%`
            :
            "loading..."
        }
      </Text>
    </View>
  );
})

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  return {
    _progress: CombinedDataSelectors.selectProgress(state),
    _loaded: CombinedDataSelectors.selectLoaded(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
  return {};
};

export const LoadingScreen = connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);