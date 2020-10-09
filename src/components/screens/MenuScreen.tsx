import React, { Dispatch, useState, useCallback, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import { View, Dimensions, ScaledSize } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { ICompiledMenu, ICurrency, ICompiledLanguage, ICompiledOrderType, ICompiledProduct, IOrderPosition } from "@djonnyx/tornado-types";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions, MyOrderActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";
import { theme } from "../../theme";

interface IMenuSelfProps {
    // store props
    _languages: Array<ICompiledLanguage>;
    _orderSum: number;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menu: ICompiledMenu;
    _language: ICompiledLanguage;
    _orderPositions: Array<IOrderPosition>;

    // store dispatches
    _onChangeLanguage: (language: ICompiledLanguage) => void;
    _onChangeOrderType: (orderType: ICompiledOrderType) => void;
    _onAddOrderPosition: (position: ICompiledProduct) => void;
    _onUpdateOrderPosition: (position: ICompiledProduct) => void;
    _onRemoveOrderPosition: (position: ICompiledProduct) => void;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = React.memo(({
    _languages, _orderTypes, _defaultCurrency,
    _menu, _language, _orderPositions, _orderSum,
    _onChangeLanguage, _onChangeOrderType,
    _onAddOrderPosition, _onUpdateOrderPosition,
    _onRemoveOrderPosition, navigation, route,
}: IMenuProps) => {
    const [windowSize, _setWindowSize] = useState({ width: Dimensions.get("window").width, height: Dimensions.get("window").height });

    const myOrderWidth = 170;
    let menuWidth = windowSize.width - myOrderWidth;

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

    const cancelHandler = useCallback(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: MainNavigationScreenTypes.INTRO },
                ],
            })
        );
    }, []);

    return (
        <View style={{ flexDirection: "row", width: "100%", height: "100%", backgroundColor: theme.themes[theme.name].menu.background }}>
            <View style={{ position: "absolute", width: menuWidth, height: "100%", zIndex: 1 }}>
                <Menu currency={_defaultCurrency} language={_language} menu={_menu} width={menuWidth} height={windowSize.height} positions={_orderPositions} cancelOrder={cancelHandler}
                    addPosition={_onAddOrderPosition} updatePosition={_onUpdateOrderPosition} removePosition={_onRemoveOrderPosition}
                ></Menu>
            </View>
            <View style={{ position: "absolute", width: myOrderWidth, height: "100%", left: menuWidth, zIndex: 2 }}>
                <MyOrderPanel currency={_defaultCurrency} sum={_orderSum} language={_language} languages={_languages} orderTypes={_orderTypes} positions={_orderPositions}
                    addPosition={_onAddOrderPosition} updatePosition={_onUpdateOrderPosition} removePosition={_onRemoveOrderPosition}
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
        _orderPositions: MyOrderSelectors.selectPositions(state),
        _orderSum: MyOrderSelectors.selectSum(state),
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
            dispatch(MyOrderActions.addPosition({id: "", product, quantity: 1}));
        },
        _onUpdateOrderPosition: (product: ICompiledProduct) => {
            dispatch(MyOrderActions.updatePosition({id: "", product, quantity: 1}));
        },
        _onRemoveOrderPosition: (product: ICompiledProduct) => {
            dispatch(MyOrderActions.removePosition({id: "", product, quantity: 1}));
        },
    };
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);