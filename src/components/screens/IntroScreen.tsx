import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";

interface IIntroSelfProps {
    // store props
    _intros: Array<ICompiledAd>;
    _defaultLanguageCode: string;

    // self props
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = ({ _defaultLanguageCode, _intros, navigation }: IIntroProps) => {

    const pressHandler = (ad: ICompiledAd) => {
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Ads ads={_intros} languageCode={_defaultLanguageCode} onPress={pressHandler}></Ads>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
    return {
        _intros: CombinedDataSelectors.selectIntros(state),
        _defaultLanguageCode: CapabilitiesSelectors.selectDefaultLanguageCode(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);