import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads, NavMenu } from "../simple";
import { ICompiledAd, ICompiledMenu, ICompiledMenuNode, NodeTypes, ICurrency } from "@djonnyx/tornado-types";
import { CombinedDataSelectors } from "../../store/selectors";
import { SideMenu } from "../simple/side-menu/SideMenu";

interface IMenuSelfProps {
    // store props
    _currency: ICurrency;
    _menu: ICompiledMenu;
    _banners: Array<ICompiledAd>;
    _defaultLanguageCode: string;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({ _currency, _menu, _banners, _defaultLanguageCode, navigation, route }: IMenuProps) => {
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ display: 'flex', height: '10%', width: '100%', minHeight: 144 }}>
                <Ads ads={_banners} languageCode={_defaultLanguageCode} onPress={selectAdHandler}></Ads>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%', maxHeight: '90%' }}>
                <View style={{ flex: 0.15, maxWidth: 128, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <SideMenu menu={_menu} languageCode={_defaultLanguageCode} onPress={selectSideMenuCategoryHandler}></SideMenu>
                </View>
                
                <View style={{ flex: 0.85, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <NavMenu node={selectedCategoty} currency={_currency} languageCode={_defaultLanguageCode} onPress={selectNavMenuCategoryHandler}></NavMenu>
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
        _currency: CombinedDataSelectors.selectCurrency(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _defaultLanguageCode: CombinedDataSelectors.selectDefaultLanguageCode(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);