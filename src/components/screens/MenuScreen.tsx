import React, { Dispatch, useState, useCallback, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { View, Dimensions, ScaledSize } from "react-native";
import { connect } from "react-redux";
import { ICompiledMenu, ICurrency, ICompiledLanguage, ICompiledOrderType, ICompiledProduct } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";
import { theme } from "../../theme";
import { NotificationAlert } from "../simple/NotificationAlert";
import { IAlertState } from "../../interfaces";

interface IMenuSelfProps {
    // store props
    _languages: Array<ICompiledLanguage>;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menu: ICompiledMenu;
    _language: ICompiledLanguage;
    _currentScreen: MainNavigationScreenTypes | undefined;
    _orderStateId: number;
    _alertOpen: (alert: IAlertState) => void;
    _alertClose: () => void;

    // store dispatches
    _onChangeLanguage: (language: ICompiledLanguage) => void;
    _onChangeOrderType: (orderType: ICompiledOrderType) => void;
    _onAddOrderPosition: (position: ICompiledProduct) => void;
    _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => void;
    _onResetOrder: () => void;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = React.memo(({
    _languages, _orderTypes, _defaultCurrency,
    _menu, _language, _orderStateId, _currentScreen,
    _onChangeScreen, _onResetOrder, _alertOpen, _alertClose,
    _onChangeLanguage, _onChangeOrderType, _onAddOrderPosition, navigation,
}: IMenuProps) => {
    const [windowSize, _setWindowSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height });
    const [notifyLastAddedProduct, _setNotifyLastAddedProduct] = useState<ICompiledProduct>(undefined as any);
    const [showNotificationOfLastAddedProduct, _setShowNotificationOfLastAddedProduct] = useState<boolean>(false);

    const myOrderWidth = 170;
    let menuWidth = windowSize.width - myOrderWidth;

    useEffect(() => {
        _onChangeScreen(navigation);
    }, [_currentScreen]);

    useEffect(() => {
        function dimensionsChangeHandler({ window }: { window: ScaledSize }) {
            _setWindowSize(size => {
                const w = window.width;
                const h = window.height;
                menuWidth = w - myOrderWidth;
                return { width: w, height: h };
            });
        };
        Dimensions.addEventListener("change", dimensionsChangeHandler);

        return () => {
            Dimensions.removeEventListener("change", dimensionsChangeHandler);
        }
    });

    const confirmHandler = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: MainNavigationScreenTypes.CONFIRMATION_ORDER },
                ],
            })
        );
    }, []);

    const cancelOrderConfirm = () => {
        _onResetOrder();
    };

    const cancelHandler = useCallback(() => {
        _alertOpen({
            title: "Внимание!", message: "Вы действительно хотите удалить заказ?", buttons: [
                {
                    title: "Удалить",
                    action: () => {
                        cancelOrderConfirm();
                        _alertClose();
                    }
                },
                {
                    title: "Отмена",
                    action: () => {
                        _alertClose();
                    }
                }
            ]
        });
    }, []);

    const addProductHandler = (product: ICompiledProduct) => {
        _onAddOrderPosition(product);
        _setNotifyLastAddedProduct(() => product);
        _setShowNotificationOfLastAddedProduct(() => true);
    };

    const addProductNotificationComplete = useCallback(() => {
        _setShowNotificationOfLastAddedProduct(() => false);
    }, [_setNotifyLastAddedProduct, notifyLastAddedProduct]);

    return (
        <View style={{ flexDirection: "row", width: "100%", height: "100%", backgroundColor: theme.themes[theme.name].menu.background }}>
            {
                !!notifyLastAddedProduct
                    ?
                    <NotificationAlert message={`"${notifyLastAddedProduct.contents[_language.code].name}" добавлен в заказ!`}
                        visible={showNotificationOfLastAddedProduct}
                        duration={5000}
                        onComplete={addProductNotificationComplete}
                    />
                    :
                    undefined
            }
            <View style={{ position: "absolute", width: menuWidth, height: "100%", zIndex: 1 }}>
                <Menu currency={_defaultCurrency} language={_language} menu={_menu} width={menuWidth} height={windowSize.height}
                    cancelOrder={cancelHandler} addPosition={addProductHandler}
                ></Menu>
            </View>
            <View style={{ position: "absolute", width: myOrderWidth, height: "100%", left: menuWidth, zIndex: 2 }}>
                <MyOrderPanel orderStateId={_orderStateId} currency={_defaultCurrency} language={_language} languages={_languages} orderTypes={_orderTypes}
                    onChangeLanguage={_onChangeLanguage} onChangeOrderType={_onChangeOrderType} onConfirm={confirmHandler}></MyOrderPanel>
            </View>
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _defaultCurrency: CombinedDataSelectors.selectDefaultCurrency(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _languages: CombinedDataSelectors.selectLangages(state),
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeLanguage: (language: ICompiledLanguage) => {
            dispatch(CapabilitiesActions.setLanguage(language));
        },
        _onChangeOrderType: (orderType: ICompiledOrderType) => {
            dispatch(CapabilitiesActions.setOrderType(orderType));
        },
        _onAddOrderPosition: (product: ICompiledProduct) => {
            dispatch(MyOrderActions.edit(product));
        },
        _onChangeScreen: (navigator: StackNavigationProp<any, MainNavigationScreenTypes>) => {
            dispatch(CapabilitiesActions.setCurrentScreen(navigator, MainNavigationScreenTypes.MENU));
        },
        _onResetOrder: () => {
            dispatch(MyOrderActions.reset());
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
        _alertClose: (alert: IAlertState) => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);