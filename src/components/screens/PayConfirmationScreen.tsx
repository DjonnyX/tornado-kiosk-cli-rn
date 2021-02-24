import React, { Dispatch, useCallback } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import QRCode from 'react-native-qrcode-svg';
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import { OrderWizard } from "../../core/order/OrderWizard";

interface IPayConfirmationScreenSelfProps {
    // store props
    _orderStateId: number;
    _language: ICompiledLanguage;

    // self props
}

interface IPayConfirmationScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.PAY_CONFIRMATION>,
    IPayConfirmationScreenSelfProps { }

const PayConfirmationScreenScreenContainer = React.memo(({ _language, _orderStateId, navigation }: IPayConfirmationScreenProps) => {
    const pressHandler = useCallback(() => {
        // etc
    }, []);

    return (
        <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <View style={{ width: "100%" }}>
                <Text>
                    Вы оплатили заказ на сумму {OrderWizard.current.getFormatedSum(true)}
                </Text>
                <QRCode
                    value="Ссылка на просмотр статуса заказа"
                />
            </View>
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IPayConfirmationScreenProps) => {
    return {
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const PayConfirmationScreenScreen = connect(mapStateToProps, mapDispatchToProps)(PayConfirmationScreenScreenContainer);