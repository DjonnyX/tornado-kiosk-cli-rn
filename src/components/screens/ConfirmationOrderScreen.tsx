import React, { Dispatch, useCallback, useEffect } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { connect } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ICompiledLanguage, ICompiledAd, ICurrency, IKioskTheme } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads, SimpleButton } from "../simple";
import { MyOrderActions, NotificationActions } from "../../store/actions";
import { ConfirmationOrderListItem } from "../simple/confirmation-order-list"
import { IAlertState } from "../../interfaces";
import { localize } from "../../utils/localization";
import { IOrderWizard } from "../../core/interfaces";

interface IConfirmationOrderScreenSelfProps {
    // store props
    _confirmOrder: () => void;
    _alertOpen: (alert: IAlertState) => void;
    _theme: IKioskTheme;
    _orderStateId: number;
    _menuStateId: number;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _currency: ICurrency;
    _orderWizard: IOrderWizard | undefined;

    // self props
}

interface IConfirmationOrderScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IConfirmationOrderScreenSelfProps { }

const ConfirmationOrderScreenContainer = React.memo(({ _theme, _language, _banners, _currency, _orderStateId, _menuStateId, _orderWizard, navigation,
    _confirmOrder, _alertOpen }: IConfirmationOrderScreenProps) => {

    const selectAdHandler = useCallback((ad: ICompiledAd) => {
        // etc...
    }, []);

    const onNext = useCallback(() => {
        _confirmOrder();
    }, []);

    const onPrevious = useCallback(() => {
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }, []);

    const theme = _theme?.themes?.[_theme?.name];

    return (
        <>
            {
                !!theme &&
                <View style={{ flex: 1, backgroundColor: theme.confirmation.backgroundColor }}>
                    {
                        _banners.length > 0
                            ?
                            <View style={{ display: "flex", height: "10%", width: "100%", minHeight: 144 }}>
                                <Ads theme={theme} ads={_banners} menuStateId={_menuStateId} language={_language} onPress={selectAdHandler} />
                            </View>
                            :
                            undefined
                    }
                    <View style={{ flex: 1, flexDirection: "column", width: "100%", height: "100%", maxHeight: _banners.length > 0 ? "90%" : "100%" }}>
                        <View style={{ flex: 1 }}>
                            <SafeAreaView style={{ flex: 1, width: "100%" }}>
                                <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1 }}
                                    data={_orderWizard?.positions} renderItem={({ item, index }) => {
                                        return <ConfirmationOrderListItem key={item.id} theme={theme} orderWizard={_orderWizard} stateId={item.stateId} position={item}
                                            color={index % 2 ? theme.confirmation.item.oddBackgroundColor : undefined}
                                            currency={_currency} language={_language} alertOpen={_alertOpen} />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}>
                                </FlatList>
                            </SafeAreaView>
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", paddingHorizontal: 12, paddingVertical: 12 }}>
                            <SimpleButton title=
                                {
                                    localize(_language, "kiosk_order_prev_button")
                                }
                                styleView={{ opacity: 1, minWidth: 144 }}
                                style={{
                                    backgroundColor: theme.confirmation.backButton.backgroundColor,
                                    borderRadius: 16, padding: 20, height: 96, justifyContent: "center"
                                }}
                                textStyle={{
                                    textAlign: "center", fontWeight: "600",
                                    color: theme.confirmation.backButton.textColor,
                                    fontSize: theme.confirmation.backButton.textFontSize,
                                    textTransform: "uppercase"
                                }}
                                onPress={onPrevious}></SimpleButton>
                            <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                                <Text style={{
                                    fontSize: theme.confirmation.summaryPrice.textFontSize,
                                    fontWeight: "600",
                                    color: theme.confirmation.summaryPrice.textColor,
                                    textAlign: "center",
                                    textTransform: "uppercase"
                                }}>
                                    {
                                        localize(_language, "kiosk_order_sum", _orderWizard?.getFormatedSum(true) || "")
                                    }
                                </Text>
                            </View>
                            <SimpleButton title=
                                {
                                    localize(_language, "kiosk_order_next_button")
                                }
                                styleView={{ opacity: 1, minWidth: 144 }}
                                style={{
                                    backgroundColor: theme.confirmation.nextButton.backgroundColor,
                                    borderRadius: 16, padding: 20, height: 96, justifyContent: "center"
                                }}
                                textStyle={{
                                    textAlign: "center",
                                    fontWeight: "600", color: theme.confirmation.nextButton.textColor,
                                    fontSize: theme.confirmation.nextButton.textFontSize, textTransform: "uppercase"
                                }}
                                onPress={onNext}></SimpleButton>
                        </View>
                    </View>
                </View>
            }
        </>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IConfirmationOrderScreenProps) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _theme: CapabilitiesSelectors.selectTheme(state),
        _banners: CombinedDataSelectors.selectBanners(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
        _confirmOrder: () => {
            dispatch(MyOrderActions.isProcessing(true));
        },
    };
};

export const ConfirmationOrderScreen = connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrderScreenContainer);