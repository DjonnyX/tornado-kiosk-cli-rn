import React, { Dispatch, useState, useCallback, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Dimensions, ScaledSize } from "react-native";
import { connect } from "react-redux";
import { ICurrency, ICompiledLanguage, ICompiledOrderType, ICompiledProduct } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { CombinedDataSelectors, MenuSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";
import { theme } from "../../theme";
import { IAlertState } from "../../interfaces";
import { MenuWizard } from "../../core/menu/MenuWizard";
import { MenuNode } from "../../core/menu/MenuNode";
import { localize } from "../../utils/localization";

interface IMenuSelfProps {
    // store props
    _theme: string;
    _languages: Array<ICompiledLanguage>;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menuStateId: number;
    _language: ICompiledLanguage;
    _orderType: ICompiledOrderType;
    _orderStateId: number;
    _isShowOrderTypes: boolean;
    _alertOpen: (alert: IAlertState) => void;

    // store dispatches
    _onChangeLanguage: (language: ICompiledLanguage) => void;
    _onChangeOrderType: (orderType: ICompiledOrderType) => void;
    _onAddOrderPosition: (productNode: MenuNode) => void;
    _onResetOrder: () => void;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = React.memo(({ _theme,
    _languages, _orderTypes, _defaultCurrency, _orderType,
    _menuStateId, _language, _orderStateId, _isShowOrderTypes, _onResetOrder, _alertOpen,
    _onChangeLanguage, _onChangeOrderType, _onAddOrderPosition, navigation,
}: IMenuProps) => {
    const [windowSize, _setWindowSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height });

    const myOrderWidth = 170;
    let menuWidth = windowSize.width - myOrderWidth;

    useEffect(() => {
        const dimensionsChangeHandler = ({ window }: { window: ScaledSize }) => {
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
        navigation.navigate(MainNavigationScreenTypes.CONFIRMATION_ORDER);
    }, []);

    const cancelOrderConfirm = () => {
        _onResetOrder();
    };

    const cancelHandler = useCallback(() => {
        _alertOpen({
            title: localize(_language, "kiosk_remove_order_title"),
            message: localize(_language, "kiosk_remove_order_message"),
            buttons: [
                {
                    title: localize(_language, "kiosk_remove_order_button_accept"),
                    action: () => {
                        cancelOrderConfirm();
                    }
                },
                {
                    title: localize(_language, "kiosk_remove_order_button_cancel"),
                }
            ]
        });
    }, [_language]);

    const addProductHandler = (productNode: MenuNode) => {
        _onAddOrderPosition(productNode);
    };

    return (
        !!MenuWizard.current.menu &&
        <View style={{ flexDirection: "row", width: "100%", height: "100%", backgroundColor: theme.themes[theme.name].menu.backgroundColor }}>
            <View style={{ position: "absolute", width: menuWidth, height: "100%", zIndex: 1 }}>
                <Menu themeName={_theme} menuStateId={_menuStateId} orderType={_orderType} currency={_defaultCurrency} language={_language} menu={MenuWizard.current.menu}
                    width={menuWidth} height={windowSize.height} cancelOrder={cancelHandler} addPosition={addProductHandler}
                ></Menu>
            </View>
            <View style={{ position: "absolute", width: myOrderWidth, height: "100%", left: menuWidth, zIndex: 2 }}>
                <MyOrderPanel themeName={_theme} isShowOrderTypes={_isShowOrderTypes} orderStateId={_orderStateId} currency={_defaultCurrency} language={_language} languages={_languages}
                    orderType={_orderType} orderTypes={_orderTypes}
                    onChangeLanguage={_onChangeLanguage} onChangeOrderType={_onChangeOrderType} onConfirm={confirmHandler}></MyOrderPanel>
            </View>
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _defaultCurrency: CombinedDataSelectors.selectDefaultCurrency(state),
        _menuStateId: MenuSelectors.selectStateId(state),
        _languages: CombinedDataSelectors.selectLangages(state),
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderType: CapabilitiesSelectors.selectOrderType(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _isShowOrderTypes: MyOrderSelectors.selectShowOrderTypes(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeLanguage: (language: ICompiledLanguage) => {
            dispatch(CapabilitiesActions.setLanguage(language));
        },
        _onChangeOrderType: (orderType: ICompiledOrderType) => {
            dispatch(CapabilitiesActions.setOrderType(orderType));
            dispatch(MyOrderActions.updateShowOrderTypes(false));
        },
        _onAddOrderPosition: (productNode: MenuNode<ICompiledProduct>) => {
            dispatch(MyOrderActions.edit(productNode));
        },
        _onResetOrder: () => {
            dispatch(MyOrderActions.reset());
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);