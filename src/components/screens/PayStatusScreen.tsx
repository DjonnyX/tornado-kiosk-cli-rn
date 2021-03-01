import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import FastImage from "react-native-fast-image";

interface IPayStatusScreenSelfProps {
    // store props
    _language: ICompiledLanguage;

    // self props
}

interface IPayStatusScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.PAY_STATUS>, IPayStatusScreenSelfProps { }

const PayStatusScreenContainer = React.memo(({ _language, navigation }: IPayStatusScreenProps) => {
    return (
        <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <View style={{alignItems: "center", width: 620 }}>
                <Text style={{ fontSize: 40, fontWeight: "bold", textAlign: "center", color: "rgba(0,0,0,0.75)" }}>
                    Следуйте указаниям на экране платежного терминала
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "rgba(0,0,0,0.5)", marginBottom: 40 }}>
                    Follow the instructions on the payment terminal
                </Text>
                <FastImage style={{ width: 128, height: 128 }}
                    source={require("./imgs/processing-indicator.gif")}
                    resizeMode="contain" />
            </View>
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IPayStatusScreenProps) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const PayStatusScreen = connect(mapStateToProps, mapDispatchToProps)(PayStatusScreenContainer);