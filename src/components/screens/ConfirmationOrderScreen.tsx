import React, { Dispatch, useCallback } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ICompiledLanguage, ICompiledAd } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";

interface IConfirmationOrderScreenSelfProps {
    // store props
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;

    // self props
}

interface IConfirmationOrderScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IConfirmationOrderScreenSelfProps { }

const ConfirmationOrderScreenContainer = React.memo(({ _language, _banners, navigation }: IConfirmationOrderScreenProps) => {

    const selectAdHandler = useCallback((ad: ICompiledAd) => {
        // etc...
    }, []);

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

            </View>
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IConfirmationOrderScreenProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const ConfirmationOrderScreen = connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrderScreenContainer);