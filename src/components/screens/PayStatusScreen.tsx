import React, { Dispatch, useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { ICompiledLanguage, IKioskTheme } from "@djonnyx/tornado-types";
import FastImage from "react-native-fast-image";
import { localize } from "../../utils/localization";
import { config } from "../../Config";

interface IPayStatusScreenSelfProps {
    // store props
    _theme: IKioskTheme;
    _language: ICompiledLanguage;

    // self props
}

interface IPayStatusScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.PAY_STATUS>, IPayStatusScreenSelfProps { }

const PayStatusScreenContainer = React.memo(({ _theme, _language, navigation }: IPayStatusScreenProps) => {
    const theme = _theme?.themes?.[_theme?.name];
    return (
        <>
            {
                !!theme &&
                <View style={{
                    flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
                    backgroundColor: theme.payStatus.backgroundColor
                }}>
                    <View style={{ alignItems: "center", width: "80%", maxWidth: 620 }}>
                        <Text style={{
                            fontFamily: config.fontFamilyRegular,
                            fontSize: theme.payStatus.primaryMessageFontSize, fontWeight: "600", textAlign: "center",
                            color: theme.payStatus.primaryMessageColor
                        }}>
                            {
                                localize(_language, "kiosk_pay_status_title")
                            }
                        </Text>
                        <Text style={{
                            fontFamily: config.fontFamilyRegular,
                            fontSize: theme.payStatus.secondaryMessageFontSize, fontWeight: "600", textAlign: "center",
                            color: theme.payStatus.secondaryMessageColor, marginBottom: 40
                        }}>
                            {
                                localize(_language, "kiosk_pay_status_description")
                            }
                        </Text>
                        <FastImage style={{ width: 128, height: 128 }}
                            source={{
                                uri: `file://${theme.payStatus.processIndicator.backgroundImage?.asset?.path}`,
                            }}
                            resizeMode="contain" />
                    </View>
                </View >
            }
        </>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IPayStatusScreenProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const PayStatusScreen = connect(mapStateToProps, mapDispatchToProps)(PayStatusScreenContainer);