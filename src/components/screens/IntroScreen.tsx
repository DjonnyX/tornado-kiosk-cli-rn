import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MenuSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";
import { ICompiledLanguage, IKioskTheme } from "@djonnyx/tornado-types";
import { MyOrderActions } from "../../store/actions";

interface IIntroSelfProps {
    // store props
    _theme: IKioskTheme;
    _menuStateId: number;
    _intros: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _orderRespawn: () => void;

    // self props
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = React.memo(({ _theme, _language, _intros, _menuStateId, _orderRespawn, navigation, route }: IIntroProps) => {
    const pressHandler = (ad: ICompiledAd) => {
        _orderRespawn();
    };

    const theme = _theme?.themes?.[_theme?.name];

    return (
        <>
            {
                !!theme &&
                <View style={{
                    flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
                    backgroundColor: theme.intro.backgroundColor
                }}>
                    <Ads theme={theme} ads={_intros} menuStateId={_menuStateId} language={_language} onPress={(ad) => { pressHandler(ad); }} />
                </View >
            }
        </>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _intros: CombinedDataSelectors.selectIntros(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _orderRespawn: () => {
            dispatch(MyOrderActions.respawn());
        },
    };
};

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);