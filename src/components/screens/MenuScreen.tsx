import React, { Dispatch, useState, useCallback, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Dimensions, ScaledSize, LayoutChangeEvent } from "react-native";
import { connect } from "react-redux";
import { ICurrency, ICompiledLanguage, ICompiledOrderType, ICompiledProduct, IKioskTheme, ICompiledTag } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { CombinedDataSelectors, MenuSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";
import { IAlertState } from "../../interfaces";
import { MenuWizard } from "../../core/menu/MenuWizard";
import { MenuNode } from "../../core/menu/MenuNode";
import { localize } from "../../utils/localization";
import { IOrderWizard } from "../../core/interfaces";
import { uiutils } from "../../utils/ui";
import DropShadow from "react-native-drop-shadow";

interface IMenuSelfProps {
    // store props
    _theme: IKioskTheme;
    _menuWizard: MenuWizard | undefined;
    _orderWizard: IOrderWizard | undefined;
    _languages: Array<ICompiledLanguage>;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menuStateId: number;
    _tags: Array<ICompiledTag>;
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

const MenuScreenContainer = React.memo(({ _theme, _tags,
    _languages, _orderTypes, _defaultCurrency, _orderType, _menuWizard, _orderWizard,
    _menuStateId, _language, _orderStateId, _isShowOrderTypes, _onResetOrder, _alertOpen,
    _onChangeLanguage, _onChangeOrderType, _onAddOrderPosition, navigation,
}: IMenuProps) => {
    const [windowSize, _setWindowSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height });
    const [dimentions, _setDimentions] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height })

    const myOrderWidth = 170;
    let menuWidth: number = windowSize.width - myOrderWidth;
    let menuHeight: number = dimentions.height;

    useEffect(() => {
        menuWidth = windowSize.width - myOrderWidth;
        menuHeight = dimentions.height;
    }, [dimentions]);

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
        if (!_orderWizard?.positions?.length) {
            cancelOrderConfirm();
        } else {
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
        }
    }, [_language]);

    const addProductHandler = (productNode: MenuNode) => {
        _onAddOrderPosition(productNode);
    };

    const onChangeLayout = useCallback((event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        _setDimentions({ width, height });
    }, []);

    const theme = _theme?.themes?.[_theme?.name];

    const dropShadowStyles = uiutils.createShadow("rgba(0,0,0,0.75)", 16);
    return (
        <>
            {
                !!theme &&
                !!_menuWizard?.menu &&
                <View onLayout={onChangeLayout} style={{
                    flexDirection: "row", width: "100%", height: "100%",
                    backgroundColor: "#fbfbfb", //theme.menu.backgroundColor
                }}>
                    <View style={{ position: "absolute", width: menuWidth, height: "100%", zIndex: 1 }}>
                        <Menu theme={theme} menuStateId={_menuStateId} orderStateId={_orderStateId} orderWizard={_orderWizard!} orderType={_orderType} currency={_defaultCurrency}
                            language={_language} menu={_menuWizard.menu} tags={_tags}
                            width={menuWidth} height={dimentions.height} cancelOrder={cancelHandler} addPosition={addProductHandler}
                        ></Menu>
                    </View>
                    <View style={{
                        position: "absolute",
                        width: myOrderWidth - theme.menu.draftOrder.padding,
                        height: menuHeight - theme.menu.draftOrder.padding * 2,
                        left: menuWidth, zIndex: 2,
                        backgroundColor: theme.menu.draftOrder.backgroundColor,
                        top: theme.menu.draftOrder.padding,
                        borderRadius: theme.menu.draftOrder.borderRadius,
                        borderWidth: 1, borderColor: "#f0f0f0",
                    }}>
                        <DropShadow style={{ flex: 1, ...dropShadowStyles }}>
                            <MyOrderPanel theme={theme} isShowOrderTypes={_isShowOrderTypes} orderStateId={_orderStateId}
                                currency={_defaultCurrency} language={_language} languages={_languages}
                                orderType={_orderType} orderTypes={_orderTypes} orderWizard={_orderWizard}
                                onChangeLanguage={_onChangeLanguage} onChangeOrderType={_onChangeOrderType} onConfirm={confirmHandler}></MyOrderPanel>
                        </DropShadow>
                    </View>
                </View>
            }
        </>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _menuWizard: MenuSelectors.selectWizard(state),
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _theme: CapabilitiesSelectors.selectTheme(state),
        _defaultCurrency: CombinedDataSelectors.selectDefaultCurrency(state),
        _menuStateId: MenuSelectors.selectStateId(state),
        _languages: CombinedDataSelectors.selectLangages(state),
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _tags: CombinedDataSelectors.selectTags(state),
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