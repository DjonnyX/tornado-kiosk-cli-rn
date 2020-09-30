import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Dimensions } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads } from "../simple";
import { ICompiledAd, ICompiledMenu, ICurrency, ICompiledLanguage, ICompiledOrderType, ICompiledProduct } from "@djonnyx/tornado-types";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions, MyOrderActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";

interface IMenuSelfProps {
    // store props
    _languages: Array<ICompiledLanguage>;
    _orderSum: number;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menu: ICompiledMenu;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _orderPositions: Array<ICompiledProduct>;

    // store dispatches
    _onChangeLanguage: (language: ICompiledLanguage) => void;
    _onChangeOrderType: (orderType: ICompiledOrderType) => void;
    _onAddOrderPosition: (position: ICompiledProduct) => void;
    _onUpdateOrderPosition: (position: ICompiledProduct) => void;
    _onRemoveOrderPosition: (position: ICompiledProduct) => void;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({
    _languages, _orderTypes, _defaultCurrency,
    _menu, _banners, _language, _orderPositions, _orderSum,
    _onChangeLanguage, _onChangeOrderType,
    _onAddOrderPosition, _onUpdateOrderPosition,
    _onRemoveOrderPosition, navigation, route,
}: IMenuProps) => {
    const [width, _setWidth] = useState(Dimensions.get("window").width);

    const selectAdHandler = (ad: ICompiledAd) => {
        // etc...
    }

    const myOrderWidth = 156;
    let menuWidth = width - myOrderWidth;

    Dimensions.addEventListener("change", ({ window }) => {
        _setWidth(prevWidth => {
            const w = window.width;
            menuWidth = w - myOrderWidth;
            return w;
        });
    });

    const confirmHandler = () => {
        navigation.navigate(MainNavigationScreenTypes.MY_ORDER);
    };

    const cancelHandler = () => {
        navigation.navigate(MainNavigationScreenTypes.INTRO);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
                <View style={{ display: "flex", width: width - myOrderWidth, height: "100%", zIndex: 1 }}>
                    <Menu currency={_defaultCurrency} language={_language} menu={_menu} width={menuWidth} positions={_orderPositions} cancelOrder={cancelHandler}
                        addPosition={_onAddOrderPosition} updatePosition={_onUpdateOrderPosition} removePosition={_onRemoveOrderPosition}
                    ></Menu>
                </View>
                <View style={{ display: "flex", width: myOrderWidth, height: "100%", zIndex: 2 }}>
                    <MyOrderPanel currency={_defaultCurrency} sum={_orderSum} language={_language} languages={_languages} orderTypes={_orderTypes} positions={_orderPositions}
                        addPosition={_onAddOrderPosition} updatePosition={_onUpdateOrderPosition} removePosition={_onRemoveOrderPosition}
                        onChangeLanguage={_onChangeLanguage} onChangeOrderType={_onChangeOrderType} onConfirm={confirmHandler}></MyOrderPanel>
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
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
        _onAddOrderPosition: (position: ICompiledProduct) => {
            dispatch(MyOrderActions.addPosition(position));
        },
        _onUpdateOrderPosition: (position: ICompiledProduct) => {
            dispatch(MyOrderActions.updatePosition(position));
        },
        _onRemoveOrderPosition: (position: ICompiledProduct) => {
            dispatch(MyOrderActions.removePosition(position));
        },
    };
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);