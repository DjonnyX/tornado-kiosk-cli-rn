import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads, NavMenu } from "../simple";
import { ICompiledAd, ICompiledMenu, ICompiledMenuNode } from "@djonnyx/tornado-types";
import { CombinedDataSelectors } from "../../store/selectors";
import { SideMenu } from "../simple/side-menu/SideMenu";

interface IMenuSelfProps {
    // store props
    _menu: ICompiledMenu;
    _banners: Array<ICompiledAd>;
    _defaultLanguageCode: string;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({ _menu, _banners, _defaultLanguageCode, navigation, route }: IMenuProps) => {
    const [selectedCategoty, _setSelectedCategory] = useState(_menu);

    const setSelectedCategory = (category: ICompiledMenuNode) => {
        _setSelectedCategory(prevCategory => category);
    };

    const selectAdHandler = (ad: ICompiledAd) => {
        // navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    const selectCategoryHandler = (node: ICompiledMenuNode) => {
        setSelectedCategory(node);
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ display: 'flex', height: '10%', width: '100%', minHeight: 178 }}>
                <Ads ads={_banners} languageCode={_defaultLanguageCode} onPress={selectAdHandler}></Ads>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%', maxHeight: '90%' }}>
                <View style={{ flex: 0.2, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <SideMenu menu={_menu} languageCode={_defaultLanguageCode} onPress={selectCategoryHandler}></SideMenu>
                </View>
                
                <View style={{ flex: 0.8, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <NavMenu node={selectedCategoty} languageCode={_defaultLanguageCode} onPress={selectCategoryHandler}></NavMenu>
                </View>
            </View>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _defaultLanguageCode: CombinedDataSelectors.selectDefaultLanguageCode(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);