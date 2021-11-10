import { ICompiledLanguage, ICurrency, IKioskTheme, IKioskThemeData } from "@djonnyx/tornado-types";
import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { PositionWizardModes } from "../../core/enums";
import { IOrderWizard, IPositionWizard } from "../../core/interfaces";
import { PositionWizardEventTypes } from "../../core/position-wizard/events";
import { IAlertState } from "../../interfaces";
import { NotificationActions } from "../../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { IAppState } from "../../store/state";
import { Icons } from "../../theme";
import { localize } from "../../utils/localization";
import { GridList } from "../layouts/GridList";
import { ModalRollTop } from "./ModalRollTop";
import { NumericStapper } from "./NumericStapper";
import { SimpleButton } from "./SimpleButton";

const MODIFIER_ITEM_WIDTH = 218;

interface IBound {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IPositionDetailsProps {
    _theme?: IKioskTheme;
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _orderStateId?: number;
    _orderWizard?: IOrderWizard | undefined;
    _alertOpen?: (alert: IAlertState) => void;
}

export const PositionDetailsContainer = React.memo(({ _theme, _orderStateId, _language, _currency, _orderWizard, _alertOpen }: IPositionDetailsProps) => {
    const [stateId, setStateId] = useState<number>(-1);
    const [position, setPosition] = useState<IPositionWizard | null>(_orderWizard?.viewingPosition || null);
    const _scrollViewRef = useRef<ScrollView>()

    useEffect(() => {
        setStateId(_orderStateId || 0);
        setPosition(_orderWizard?.viewingPosition || null);
    }, [_orderStateId]);

    useEffect(() => {
        const changeProductHandler = () => {
            setStateId(position?.stateId || 0);
        };

        if (position?.mode === PositionWizardModes.NEW) {
            position.addListener(PositionWizardEventTypes.CHANGE, changeProductHandler);
        }
        return () => {
            if (!!position) {
                position.addListener(PositionWizardEventTypes.CHANGE, changeProductHandler);
            }
        }
    }, [position]);

    const onClose = useCallback(() => {
        if (!!_orderWizard) {
            _orderWizard.removeViewingPosition();
        }
    }, [position, _orderWizard]);

    const onAdd = useCallback(() => {
        if (!!_orderWizard) {
            if (position?.mode === PositionWizardModes.NEW) {
                _orderWizard.addViewingProduct();
            } else if (position?.mode === PositionWizardModes.EDIT) {
                _orderWizard.closeViewingPosition();
            }
        }
    }, [position, _orderWizard]);

    const onRemove = useCallback(() => {
        if (!!_orderWizard) {
            console.warn("onRemove")
            _orderWizard.removeViewingPosition();
        }
    }, [position, _orderWizard]);

    const changeQuantityHandler = (qnt: number | boolean) => {
        if (qnt < 1) {
            _alertOpen!({
                title: localize(_language!, "kiosk_remove_product_title"),
                message: localize(_language!, "kiosk_remove_product_message"),
                buttons: [
                    {
                        title: localize(_language!, "kiosk_remove_product_button_accept"),
                        action: () => {
                            if (position?.mode === PositionWizardModes.NEW) {
                                _orderWizard?.removeViewingPosition();
                            } else if (position?.mode === PositionWizardModes.EDIT) {
                                onRemove();
                            }
                        }
                    },
                    {
                        title: localize(_language!, "kiosk_remove_product_button_cancel"),
                        action: () => {
                            position!.quantity = 1;
                        }
                    }
                ]
            });
            return;
        }

        if (!!position) {
            position.quantity = Number(qnt);
        }
    }

    const theme = _theme?.themes?.[_theme?.name] as IKioskThemeData;

    return (
        <>
            {
                !!theme &&
                <ModalRollTop theme={theme} visible={!!position}>
                    <View style={{ flex: 1, width: "100%" }}>
                        {
                            !!position && !!_language && !!_currency &&
                            <View style={{
                                flex: 1, width: "100%",
                                backgroundColor: theme.details.backgroundColor,
                            }}>
                                <View style={{
                                    flexDirection: "row", width: "100%",
                                    marginBottom: 32, paddingLeft: 34, paddingRight: 34, paddingTop: 34,
                                }}>
                                    <View style={{
                                        flex: 1, width: "100%", flexDirection: "row", alignItems: "flex-start", marginRight: 48, marginBottom: 8,
                                        overflow: "hidden"
                                    }}>
                                        <View style={{ alignItems: "center" }}>
                                            <FastImage style={{ width: Dimensions.get("window").width * .5, height: Dimensions.get("window").height, borderRadius: 16, overflow: "hidden" }} source={{
                                                uri: `file://${position.__product__?.contents[_language?.code]?.resources?.icon.path}`,
                                            }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            marginVertical: 30, marginHorizontal: 30,
                                            paddingHorizontal: 54, paddingVertical: 54,
                                            backgroundColor: theme.details.frame.backgroundColor, borderRadius: 24,
                                        }}>
                                            <Text style={{
                                                textAlign: "center",
                                                fontSize: theme.details.frame.nameFontSize, fontWeight: "bold", color: theme.details.frame.nameColor,
                                                textTransform: "uppercase", marginBottom: 22,
                                            }}>{
                                                    position.__product__?.contents[_language.code]?.name
                                                }</Text>
                                            <Text style={{
                                                textAlign: "center",
                                                fontSize: theme.details.frame.descriptionFontSize, color: theme.details.frame.descriptionColor,
                                                lineHeight: theme.details.frame.descriptionFontSize * 1.5,
                                                textTransform: "uppercase", marginBottom: 32,
                                            }}>{
                                                    position.__product__?.contents[_language.code]?.description
                                                }</Text>

                                            <View style={{
                                                alignItems: "center",
                                                marginBottom: 22,
                                            }}>
                                                <Text style={{
                                                    backgroundColor: theme.details.frame.price.backgroundColor,
                                                    paddingVertical: 14, paddingHorizontal: 28,
                                                    borderRadius: 14, borderWidth: 2, borderColor: theme.details.frame.price.borderColor,
                                                    fontSize: theme.details.frame.price.textFontSize, fontWeight: "bold",
                                                    color: theme.details.frame.price.textColor,
                                                    textTransform: "uppercase",
                                                }}>{
                                                        position.getFormatedSumPerOne(true)
                                                    }</Text>
                                            </View>
                                            <View style={{
                                                flex: 1,
                                                alignItems: "center",
                                            }}>
                                                <View style={{
                                                    flex: 1,
                                                    alignSelf: "center",
                                                    width: 220,
                                                }}>
                                                    <NumericStapper
                                                        value={position.quantity}
                                                        buttonStyle={{
                                                            width: 64, height: 64, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                                                            backgroundColor: theme.details.frame.quantityStepper.buttons.backgroundColor,
                                                            borderColor: theme.details.frame.quantityStepper.buttons.borderColor,
                                                            padding: 6
                                                        }}
                                                        buttonSelectedStyle={{
                                                            width: 64, height: 64, borderRadius: 16,
                                                            backgroundColor: theme.details.frame.quantityStepper.buttons.selectedBackgroundColor,
                                                            borderColor: theme.details.frame.quantityStepper.buttons.selectedBackgroundColor,
                                                            padding: 6,
                                                            opacity: 1
                                                        }}
                                                        disabledButtonStyle={{
                                                            width: 64, height: 64, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                                                            backgroundColor: theme.details.frame.quantityStepper.buttons.disabledBackgroundColor,
                                                            borderColor: theme.details.frame.quantityStepper.buttons.disabledBorderColor,
                                                            padding: 6,
                                                            opacity: 0.25
                                                        }}
                                                        disabledSelectedButtonStyle={{
                                                            width: 64, height: 64, borderRadius: 16,
                                                            backgroundColor: theme.details.frame.quantityStepper.buttons.disabledSelectedBackgroundColor,
                                                            borderColor: theme.details.frame.quantityStepper.buttons.disabledSelectedBorderColor,
                                                            padding: 6,
                                                            opacity: 0.25
                                                        }}
                                                        buttonTextStyle={{
                                                            fontSize: theme.details.frame.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                                                            color: theme.details.frame.quantityStepper.buttons.textColor as any,
                                                        }}
                                                        buttonSelectedTextStyle={{
                                                            fontSize: theme.details.frame.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                                                            color: theme.details.frame.quantityStepper.buttons.selectedTextColor as any,
                                                        }}
                                                        disabledButtonTextStyle={{
                                                            fontSize: theme.details.frame.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                                                            color: theme.details.frame.quantityStepper.buttons.disabledTextColor as any,
                                                        }}
                                                        disabledSelectedButtonTextStyle={{
                                                            fontSize: theme.details.frame.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                                                            color: theme.details.frame.quantityStepper.buttons.disabledSelectedTextColor as any,
                                                        }}
                                                        textStyle={{
                                                            fontSize: theme.details.frame.quantityStepper.indicator.textFontSize, fontWeight: "bold",
                                                            color: theme.details.frame.quantityStepper.indicator.textColor
                                                        }}
                                                        iconDecrement="-"
                                                        iconIncrement="+"
                                                        onChange={changeQuantityHandler}
                                                        formatValueFunction={(value: number) => {
                                                            return String(value);
                                                        }}
                                                        min={0}
                                                        max={100}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: "column", width: "100%", alignItems: "stretch", justifyContent: "flex-end" }}>
                                                <SimpleButton title={
                                                    position.mode === PositionWizardModes.NEW
                                                        ?
                                                        localize(_language, "kiosk_product_details_add_to_order")
                                                        :
                                                        localize(_language, "kiosk_product_details_apply")
                                                }
                                                    styleView={{
                                                        opacity: 1,
                                                        marginBottom: 14,
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        backgroundColor: theme.details.frame.buttonApply.backgroundColor,
                                                        borderColor: theme.details.frame.buttonApply.borderColor,
                                                        borderRadius: 8, padding: 20
                                                    }}
                                                    styleDisabled={{
                                                        width: "100%",
                                                        backgroundColor: theme.details.frame.buttonApply.disabledBackgroundColor,
                                                        borderRadius: 8, borderWidth: 2,
                                                        borderColor: theme.details.frame.buttonApply.disabledBorderColor,
                                                    }}
                                                    textStyle={{
                                                        width: "100%",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: theme.details.frame.buttonApply.textColor,
                                                        fontSize: theme.details.frame.buttonApply.textFontSize,
                                                    }}
                                                    textStyleDisabled={{
                                                        width: "100%",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: theme.details.frame.buttonApply.disabledTextColor,
                                                        fontSize: theme.details.frame.buttonApply.textFontSize,
                                                    }}
                                                    disabled={position.quantity === 0} onPress={onAdd} />

                                                {
                                                    position.mode === PositionWizardModes.EDIT &&
                                                    <SimpleButton title={
                                                        localize(_language, "kiosk_product_details_remove_from_order")
                                                    }
                                                        styleView={{
                                                            opacity: 1,
                                                        }}
                                                        style={{
                                                            width: "100%",
                                                            backgroundColor: theme.details.frame.buttonDelete.backgroundColor,
                                                            borderColor: theme.details.frame.buttonDelete.borderColor,
                                                            borderRadius: 8, padding: 20
                                                        }}
                                                        styleDisabled={{
                                                            width: "100%",
                                                            backgroundColor: theme.details.frame.buttonDelete.disabledBackgroundColor,
                                                            borderRadius: 8, borderWidth: 2,
                                                            borderColor: theme.details.frame.buttonDelete.disabledBorderColor,
                                                        }}
                                                        textStyle={{
                                                            width: "100%",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            color: theme.details.frame.buttonDelete.textColor,
                                                            fontSize: theme.details.frame.buttonDelete.textFontSize,
                                                        }}
                                                        textStyleDisabled={{
                                                            width: "100%",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            color: theme.details.frame.buttonDelete.disabledTextColor,
                                                            fontSize: theme.details.frame.buttonDelete.textFontSize,
                                                        }}
                                                        disabled={position.quantity === 0} onPress={onRemove} />
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <CloseButton theme={theme} onPress={onClose}></CloseButton>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                </ModalRollTop>
            }
        </>
    );
})

interface ICloseButtonProps {
    theme: IKioskThemeData;
    onPress: () => void;
}

const CloseButton = ({ theme, onPress }: ICloseButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ borderRadius: 32, backgroundColor: theme.details.frame.backgroundColor, width: 64, height: 64, alignItems: "center", justifyContent: "center" }}
            >
                <Icons name="Close" fill={theme.menu.backButton.iconColor} width={34} height={34} ></Icons>
            </View>
        </TouchableOpacity>
    )
}

const mapStateToProps = (state: IAppState, ownProps: IPositionDetailsProps) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _theme: CapabilitiesSelectors.selectTheme(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const PositionDetails = connect(mapStateToProps, mapDispatchToProps)(PositionDetailsContainer);