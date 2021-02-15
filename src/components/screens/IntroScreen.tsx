import React, { Dispatch, useCallback, useState, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { CommonActions } from "@react-navigation/native";
import { theme } from "../../theme";
import { CapabilitiesActions, MyOrderActions } from "../../store/actions";

interface IIntroSelfProps {
    // store props
    _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => void;
    _intros: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self props
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = React.memo(({ _language, _intros, navigation, _currentScreen, _onChangeScreen }: IIntroProps) => {
    useEffect(() => {
        _onChangeScreen(navigation);
    }, [_currentScreen]);

    const pressHandler = useCallback((ad: ICompiledAd) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: MainNavigationScreenTypes.MENU },
                ],
            })
        );
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: theme.themes[theme.name].intro.background }}>
            <Ads ads={_intros} language={_language} onPress={pressHandler}></Ads>
        </View>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
    return {
        _intros: CombinedDataSelectors.selectIntros(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => {
            dispatch(CapabilitiesActions.setCurrentScreen(navigator, MainNavigationScreenTypes.INTRO));
        },
    };
};

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);