import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, Button } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { Ads } from "../simple";
import { ICompiledAd } from "@djonnyx/tornado-types";
import { CombinedDataSelectors } from "../../store/selectors";

interface IMenuSelfProps {
    // store props
    _banners: Array<ICompiledAd>;
    _defaultLanguageCode: string;

    // self props
}

interface IMenuProps extends StackScreenProps<any, MainNavigationScreenTypes.MENU>, IMenuSelfProps { }

const MenuScreenContainer = ({ _banners, _defaultLanguageCode, navigation, route }: IMenuProps) => {

    const pressHandler = (ad: ICompiledAd) => {
        // navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ display: 'flex', height: '10%', width: '100%' }}>
                <Ads ads={_banners} languageCode={_defaultLanguageCode} onPress={pressHandler}></Ads>
            </View>
            <View style={{ display: 'flex', height: '90%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    Menu screen
                </Text>
                <Button title="Reset" onPress={() => {
                    navigation.navigate(MainNavigationScreenTypes.INTRO);
                }}></Button>
            </View>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IMenuProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
        _defaultLanguageCode: CombinedDataSelectors.selectDefaultLanguageCode(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const MenuScreen = connect(mapStateToProps, mapDispatchToProps)(MenuScreenContainer);