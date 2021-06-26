import React, { Dispatch, useCallback, useEffect, useState } from "react";
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
import { MyOrderActions } from "../../store/actions";
import { config } from "../../Config";
import { SimpleButton } from "../simple";
import { localize } from "../../utils/localization";

interface IPayConfirmationScreenSelfProps {
    // store props
    _onResetOrder: () => void;
    _theme: string;
    _orderStateId: number;
    _language: ICompiledLanguage;

    // self props
}

interface IPayConfirmationScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.PAY_CONFIRMATION>,
    IPayConfirmationScreenSelfProps { }

const PayConfirmationScreenScreenContainer = React.memo(({ _theme, _language, _orderStateId, _onResetOrder, navigation }: IPayConfirmationScreenProps) => {
    const [countDown, setCountDown] = useState(config.capabilities.resetTimeoutAfterPay);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(prev => prev - 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (countDown === 0) {
            _onResetOrder();
        }
    }, [countDown]);

    const onReset = useCallback(() => {
        _onResetOrder();
    }, []);

    return (
        <View style={{
            flex: 1, justifyContent: "space-around", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.backgroundColor, padding: 54
        }}>
            <View style={{ flex: 1, alignItems: "center", width: "70%", maxWidth: 620 }}>
                <Text style={{
                    fontSize: theme.themes[theme.name].payConfirmation.primaryMessageFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payConfirmation.primaryMessageColor
                }}>
                    {
                        localize(_language, "kiosk_pay_success_congratulation")
                    }
                </Text>
                <Text style={{
                    fontSize: theme.themes[theme.name].payConfirmation.primaryMessageFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payConfirmation.primaryMessageColor
                }}>
                    {
                        localize(_language, "kiosk_pay_success_order_num_title")
                    }
                </Text>
                <Text style={{
                    fontSize: theme.themes[theme.name].payConfirmation.nameFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payConfirmation.numberColor
                }}>
                    {OrderWizard.current.result?.code}
                </Text>
                <Text style={{
                    fontSize: theme.themes[theme.name].payConfirmation.secondaryMessageFontSize, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payConfirmation.secondaryMessageColor
                }}>
                    {
                        localize(_language, "kiosk_pay_success_order_description", OrderWizard.current.getFormatedSum(true))
                    }
                </Text>
                {/*<Text style={{
                    fontSize: 20, fontWeight: "bold", textAlign: "center",
                    color: theme.themes[theme.name].payConfirmation.secondaryMessageColor, marginBottom: 40
                }}>
                    {
                        localize(_language, "kiosk_pay_success_order_qrcode_description")
                    }
                </Text>
                <View style={{
                    width: 216, height: 216, justifyContent: "center", alignItems: "center",
                    borderRadius: 6, backgroundColor: "white"
                }}>
                    <QRCode
                        size={192}
                        value="Ссылка на просмотр статуса заказа"
                    />
                </View>*/}
            </View>
            <View>
                <SimpleButton title={
                    localize(_language, "kiosk_pay_success_order_button_close", String(countDown))
                }
                    styleView={{ opacity: 1, minWidth: 180 }}
                    style={{ backgroundColor: theme.themes[theme.name].confirmation.nextButton.backgroundColor, borderRadius: 8, padding: 20 }}
                    textStyle={{
                        textAlign: "center", fontWeight: "bold", fontSize: 26, textTransform: "uppercase",
                        color: theme.themes[theme.name].confirmation.nextButton.textColor,
                    }}
                    onPress={onReset}></SimpleButton>
            </View>
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IPayConfirmationScreenProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onResetOrder: () => {
            dispatch(MyOrderActions.reset());
        },
    };
};

export const PayConfirmationScreenScreen = connect(mapStateToProps, mapDispatchToProps)(PayConfirmationScreenScreenContainer);