import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CombinedDataSelectors } from "../../store/selectors";

interface IMenuSelfProps {
  // store props

  // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({ navigation }: IMenuProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
          Menu screen
      </Text>
    </View>
  );
}

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
  return { };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
  return {};
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);