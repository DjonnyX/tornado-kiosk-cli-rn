import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";

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
            <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ color: "#ffffff" }}>
                    Следуйте указаниям на экране платежного терминала
                </Text>
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