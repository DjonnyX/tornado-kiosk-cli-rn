import React, { Dispatch, useCallback, useEffect } from "react";
import { FlatList, SafeAreaView, ScrollView, View } from "react-native";
import { connect } from "react-redux";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ICompiledLanguage, ICompiledAd, IOrderPosition, ICurrency, ICompiledProduct } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";
import { theme } from "../../theme";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../../store/actions";
import { ConfirmationOrderListItem } from "../simple/confirmation-order-list";
import { OrderWizard } from "../../core/order/OrderWizard";
import { IAlertState } from "../../interfaces";

interface IConfirmationOrderScreenSelfProps {
    // store props
    _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => void;
    _alertOpen: (alert: IAlertState) => void;
    _orderStateId: number;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _currentScreen: MainNavigationScreenTypes | undefined;
    _currency: ICurrency;

    // self props
}

interface IConfirmationOrderScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IConfirmationOrderScreenSelfProps { }

const ConfirmationOrderScreenContainer = React.memo(({ _language, _banners, _currency, _currentScreen, _orderStateId, navigation,
    _onChangeScreen, _alertOpen }: IConfirmationOrderScreenProps) => {
    useEffect(() => {
        _onChangeScreen(navigation);
    }, [_currentScreen]);

    const selectAdHandler = useCallback((ad: ICompiledAd) => {
        // etc...
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].myOrder.background }}>
            {
                _banners.length > 0
                    ?
                    <View style={{ display: "flex", height: "10%", width: "100%", minHeight: 144 }}>
                        <Ads ads={_banners} language={_language} onPress={selectAdHandler}></Ads>
                    </View>
                    :
                    undefined
            }
            <View style={{ flex: 1, flexDirection: "row", width: "100%", height: "100%", maxHeight: _banners.length > 0 ? "90%" : "100%" }}>
                <SafeAreaView style={{ flex: 1, width: "100%" }}>
                    <ScrollView style={{ flex: 1 }} horizontal={false}>
                        <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={OrderWizard.current.positions} renderItem={({ item }) => {
                            return <ConfirmationOrderListItem key={item.id} stateId={item.stateId} position={item} currency={_currency} language={_language}
                                imageHeight={48} alertOpen={_alertOpen}/>
                        }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>
                    </ScrollView>
                </SafeAreaView>
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
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
        _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => {
            dispatch(CapabilitiesActions.setCurrentScreen(navigator, MainNavigationScreenTypes.CONFIRMATION_ORDER));
        },
    };
};

export const ConfirmationOrderScreen = connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrderScreenContainer);