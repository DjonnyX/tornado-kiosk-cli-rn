import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import LinearGradient from "react-native-linear-gradient";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads, NavMenu, MenuButton } from "../simple";
import { ICompiledAd, ICompiledMenu, ICompiledMenuNode, NodeTypes, ICurrency, ICompiledLanguage, ICompiledOrderType } from "@djonnyx/tornado-types";
import { CombinedDataSelectors } from "../../store/selectors";
import { SideMenu } from "../simple/side-menu/SideMenu";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { CapabilitiesActions } from "../../store/actions";
import { MyOrderPanel } from "../simple/MyOrderPanel";

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

    const [selectedCategoty, _setSelectedCategory] = useState(_menu);

    const setSelectedCategory = (category: ICompiledMenuNode) => {
        _setSelectedCategory(prevCategory => category);
    };

    const selectAdHandler = (ad: ICompiledAd) => {
        // navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    const selectSideMenuCategoryHandler = (node: ICompiledMenuNode) => {
        setSelectedCategory(node);
    }

    const selectNavMenuCategoryHandler = (node: ICompiledMenuNode) => {
        if (node.type === NodeTypes.SELECTOR || node.type === NodeTypes.SELECTOR_NODE) {
            setSelectedCategory(node);
        } else if (node.type === NodeTypes.PRODUCT) {
            // etc
        }
    }

    const onBack = () => {
        setSelectedCategory(_menu);
    }

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
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    <LinearGradient
                        colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
                        style={{ display: "flex", position: "absolute", width: "100%", height: 96, zIndex: 1 }}
                    >
                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", height: "100%", padding: 16 }}>
                            {
                                selectedCategoty !== _menu
                                    ?
                                    <View style={{ width: 132, justifyContent: "center", alignItems: "center" }}>
                                        <MenuButton onPress={onBack}></MenuButton>
                                    </View>
                                    :
                                    undefined
                            }
                            <View style={{ flex: 1 }}></View>
                            <Text style={{ fontFamily: "RobotoSlab-Black", color: "rgba(0, 0, 0, 0.75)", fontSize: 32 }}>
                                {
                                    selectedCategoty?.content?.contents[_language.code]?.name || "Меню"
                                }
                            </Text>
                        </View>
                    </LinearGradient>
                    <View style={{ flex: 1, flexDirection: "row", width: "100%", height: "100%" }}>
                        {
                            selectedCategoty !== _menu
                                ?
                                <View style={{ width: 152, height: "100%", justifyContent: "center", alignItems: "center", marginTop: 48 }}>
                                    <SideMenu menu={_menu} language={_language} selected={selectedCategoty} onPress={selectSideMenuCategoryHandler}></SideMenu>
                                </View>
                                :
                                undefined
                        }

                        <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <NavMenu node={selectedCategoty} currency={_defaultCurrency} language={_language} onPress={selectNavMenuCategoryHandler}></NavMenu>
                        </View>
                    </View>
                </View>
                <View style={{ display: "flex", width: 144, height: "100%" }}>
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