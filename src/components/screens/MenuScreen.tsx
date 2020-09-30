import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Dimensions } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads } from "../simple";
import { ICompiledAd, ICompiledMenu, ICurrency, ICompiledLanguage, ICompiledOrderType } from "@djonnyx/tornado-types";
import { CombinedDataSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";
import { Menu } from "../simple/Menu";

interface IMenuSelfProps {
    // store props
    _languages: Array<ICompiledLanguage>;
    _orderTypes: Array<ICompiledOrderType>;
    _defaultCurrency: ICurrency;
    _menu: ICompiledMenu;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;

    // store dispatches
    _onChangeLanguage: (language: ICompiledLanguage) => void;
    _onChangeOrderType: (orderType: ICompiledOrderType) => void;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({ _languages, _orderTypes, _defaultCurrency, _menu, _banners, _language, _onChangeLanguage, _onChangeOrderType, navigation, route }: IMenuProps) => {
    const [width, _setWidth] = useState(Dimensions.get("window").width);

    const selectAdHandler = (ad: ICompiledAd) => {
        // etc...
    }

    const myOrderWidth = 156;
    let menuWidth = width - myOrderWidth;

    Dimensions.addEventListener("change", ({window}) => {
        _setWidth(prevWidth => {
            const w = window.width;
            menuWidth = w - myOrderWidth;
            return w;
        });
    })

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
                <View style={{ display: "flex", width: width - myOrderWidth, height: "100%" }}>
                    <Menu currency={_defaultCurrency} language={_language} menu={_menu} width={menuWidth}></Menu>
                </View>
                <View style={{ display: "flex", width: myOrderWidth, height: "100%" }}>
                    <MyOrderPanel language={_language} languages={_languages} orderTypes={_orderTypes} onChangeLanguage={_onChangeLanguage} onChangeOrderType={_onChangeOrderType}></MyOrderPanel>
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
        _language: CapabilitiesSelectors.selecLanguage(state),
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
    };
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);