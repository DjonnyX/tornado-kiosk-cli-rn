import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, Image } from "react-native";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MainNavigationScreenTypes } from "../navigation";

interface IIntroSelfProps {
    // store
    ads: string;
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = ({ ads, navigation }: IIntroProps) => {
    const pressHandler = () => {
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => pressHandler()}>
                <Image style={{ position: 'absolute', width: '100%', height: '100%' }} source={{
                    uri: `file://${ads}`,
                    scale: 1,
                }}></Image>
            </TouchableWithoutFeedback>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
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

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);
  // navigation.navigate('Profile')