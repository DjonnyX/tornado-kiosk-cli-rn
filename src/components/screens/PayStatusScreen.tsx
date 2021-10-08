import React, { Dispatch, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import FastImage from "react-native-fast-image";
import { localize } from "../../utils/localization";

interface IPayStatusScreenSelfProps {
    // store props
    _theme: string;
    _language: ICompiledLanguage;

    // self props
}

interface IPayStatusScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.PAY_STATUS>, IPayStatusScreenSelfProps { }

const PayStatusScreenContainer = React.memo(({ _theme, _language, navigation }: IPayStatusScreenProps) => {
    return (
        <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].payStatus.backgroundColor
        }}>
            <View style={{ alignItems: "center", width: "80%", maxWidth: 620 }}>
                <Text style={{
                    fontSize: theme.themes[theme.name].payStatus.primaryMessageFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payStatus.primaryMessageColor
                }}>
                    {
                        localize(_language, "kiosk_pay_status_title")
                    }
                </Text>
                <Text style={{
                    fontSize: theme.themes[theme.name].payStatus.secondaryMessageFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payStatus.secondaryMessageColor, marginBottom: 40
                }}>
                    {
                        localize(_language, "kiosk_pay_status_description")
                    }
                </Text>
                <FastImage style={{ width: 128, height: 128 }}
                    source={theme.name === 'light'
                        ? require("./imgs/processing-indicator-light.gif")
                        : require("./imgs/processing-indicator-dark.gif")}
                    resizeMode="contain" />
            </View>
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IPayStatusScreenProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const PayStatusScreen = connect(mapStateToProps, mapDispatchToProps)(PayStatusScreenContainer);