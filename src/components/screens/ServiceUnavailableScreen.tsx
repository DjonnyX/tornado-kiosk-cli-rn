import React, { Dispatch, useCallback, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MenuSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";
import { ICompiledLanguage, IKioskTheme } from "@djonnyx/tornado-types";

interface IServiceUnavailableSelfProps {
    // store props
    _theme: IKioskTheme;
    _menuStateId: number;
    _intros: Array<ICompiledAd>;
    _language: ICompiledLanguage;

    // self props
}

interface IServiceUnavailableProps extends StackScreenProps<any, MainNavigationScreenTypes.SERVICE_UNAVAILABLE>, IServiceUnavailableSelfProps { }

const ServiceUnavailableScreenContainer = React.memo(({ _theme, _language, _intros, _menuStateId, navigation }: IServiceUnavailableProps) => {

    const theme = _theme?.themes?.[_theme?.name];
    return (
        <>
            {
                !!theme &&
                <View style={{
                    flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
                    backgroundColor: theme.intro.backgroundColor
                }}>
                    <Ads theme={theme} ads={_intros} menuStateId={_menuStateId} language={_language} onPress={() => { }} />
                </View >
            }
        </>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IServiceUnavailableProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _intros: CombinedDataSelectors.selectServiceUnavailableIntros(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const ServiceUnavailableScreen = connect(mapStateToProps, mapDispatchToProps)(ServiceUnavailableScreenContainer);