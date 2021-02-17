import React, { Dispatch, useCallback } from "react";
import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";
import { connect } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ICompiledLanguage, ICompiledAd, ICurrency } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads, SimpleButton } from "../simple";
import { theme } from "../../theme";
import { NotificationActions } from "../../store/actions";
import { ConfirmationOrderListItem } from "../simple/confirmation-order-list";
import { OrderWizard } from "../../core/order/OrderWizard";
import { IAlertState } from "../../interfaces";

interface IConfirmationOrderScreenSelfProps {
    // store props
    _alertOpen: (alert: IAlertState) => void;
    _orderStateId: number;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _currency: ICurrency;

    // self props
}

interface IConfirmationOrderScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IConfirmationOrderScreenSelfProps { }

const ConfirmationOrderScreenContainer = React.memo(({ _language, _banners, _currency, _orderStateId, navigation,
    _alertOpen }: IConfirmationOrderScreenProps) => {

    const selectAdHandler = useCallback((ad: ICompiledAd) => {
        // etc...
    }, []);

    const onNext = useCallback(() => {
        // etc...
    }, []);

    const onPrevious = useCallback(() => {
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].myOrder.background }}>
            {
                _banners.length > 0
                    ?
                    <View style={{ display: "flex", height: "10%", width: "100%", minHeight: 144 }}>
                        <Ads ads={_banners} language={_language} onPress={selectAdHandler} />
                    </View>
                    :
                    undefined
            }
            <View style={{ flex: 1, flexDirection: "column", width: "100%", height: "100%", maxHeight: _banners.length > 0 ? "90%" : "100%" }}>
                <View style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1, width: "100%" }}>
                        <ScrollView style={{ flex: 1 }} horizontal={false}>
                            <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1, margin: 20 }} data={OrderWizard.current.positions} renderItem={({ item }) => {
                                return <ConfirmationOrderListItem key={item.id} stateId={item.stateId} position={item} currency={_currency} language={_language}
                                    imageHeight={64} alertOpen={_alertOpen} />
                            }}
                                keyExtractor={(item, index) => index.toString()}>
                            </FlatList>
                        </ScrollView>
                    </SafeAreaView>
                </View>
                <View style={{ width: "100%", flexDirection: "row", paddingLeft: 40, paddingRight: 40, paddingTop: 30, paddingBottom: 30 }}>
                    <SimpleButton title="Назад"
                        styleView={{ opacity: 1 }}
                        style={{ backgroundColor: "#30a02a", borderRadius: 8, padding: 20 }}
                        textStyle={{ fontWeight: "bold", color: "#ffffff", fontSize: 26 }}
                        onPress={onPrevious}></SimpleButton>
                    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 34, fontWeight: "bold", color: "#ffffff", textAlign: "center", textTransform: "uppercase" }}>{
                            `Итого: ${OrderWizard.current.getFormatedSum(true)}`
                        }</Text>
                    </View>
                    <SimpleButton title="Далее"
                        styleView={{ opacity: 1 }}
                        style={{ backgroundColor: "#30a02a", borderRadius: 8, padding: 20 }}
                        textStyle={{ fontWeight: "bold", color: "#ffffff", fontSize: 26, textTransform: "uppercase" }}
                        onPress={onNext}></SimpleButton>
                </View>
            </View>
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IConfirmationOrderScreenProps) => {
    return {
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
    };
};

export const ConfirmationOrderScreen = connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrderScreenContainer);