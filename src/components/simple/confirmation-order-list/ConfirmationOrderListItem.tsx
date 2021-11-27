import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { IOrderWizard, IPositionWizard } from "../../../core/interfaces";
import { IAlertState } from "../../../interfaces";
import { localize } from "../../../utils/localization";
import { config } from "../../../Config";

interface ConfirmationOrderListItemProps {
    theme: IKioskThemeData;
    orderWizard: IOrderWizard | undefined;
    color?: string;
    stateId: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
    alertOpen: (alert: IAlertState) => void;
}

export const ConfirmationOrderListItem = React.memo(({ theme, stateId, orderWizard, color, currency, language, position,
    alertOpen }: ConfirmationOrderListItemProps) => {
    const currentContent = position.__product__?.contents[language?.code];
    const currentAsset = currentContent?.resources?.icon;

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        const isEditable = position.edit();
        if (!isEditable) {
            orderWizard?.editPosition(position);
        }
    }, []);

    const setQuantity = (qnt: number) => {
        position.quantity = qnt;
    }

    const changeQuantityHandler = (value: number) => {
        if (value < 1) {
            alertOpen({
                title: localize(language, "kiosk_remove_product_title"),
                message: localize(language, "kiosk_remove_product_message"),
                buttons: [
                    {
                        title: localize(language, "kiosk_remove_product_button_accept"),
                        action: () => {
                            orderWizard?.remove(position);
                        }
                    },
                    {
                        title: localize(language, "kiosk_remove_product_button_cancel"),
                        action: () => {
                            setQuantity(1);
                        }
                    }
                ]
            });

            return;
        }

        setQuantity(value);
    };

    return (
        <View style={{
            flex: 1, flexDirection: "row", paddingLeft: 28, paddingRight: 28, paddingTop: 18, paddingBottom: 18,
            backgroundColor: color || "transparent",
            alignItems: "stretch",
        }}>
            <TouchableOpacity style={{
                flex: 1, flexDirection: "row",
                alignItems: "stretch"
            }} onPress={pressHandler}>
                <View style={{ width: 48, height: 48, marginTop: 10, marginRight: 20, justifyContent: "flex-end" }}>
                    <FastImage style={{ width: 48, height: 48, borderRadius: 16, overflow: "hidden" }} source={{
                        uri: `file://${currentAsset?.mipmap?.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <View style={{ flex: 1, marginTop: 8 }}>
                    <View style={{ flexDirection: "row", marginRight: 20, alignItems: "baseline" }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={3} ellipsizeMode="tail" style={{
                                fontFamily: config.fontFamily,
                                textAlign: "left", fontSize: theme.confirmation.item.nameFontSize,
                                color: theme.confirmation.item.nameColor, fontWeight: "600"
                            }}>
                                {
                                    currentContent?.name
                                }
                            </Text>
                        </View>
                        <View style={{ width: 192, justifyContent: "flex-end" }}>
                            <Text style={{
                                fontFamily: config.fontFamily,
                                textAlign: "right", fontSize: theme.confirmation.item.price.textFontSize,
                                color: theme.confirmation.item.price.textColor, fontWeight: "600"
                            }}>
                                {
                                    `${position.quantity}x${position.getFormatedSumPerOne(true)}`
                                }
                            </Text>
                        </View>
                    </View>
                    <View>
                        {
                            position.nestedPositions.map((p, index) => <View key={index} style={{ flexDirection: "row", marginRight: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                        fontFamily: config.fontFamily,
                                        textAlign: "left", fontSize: 13,
                                        color: theme.confirmation.nestedItem.nameColor,
                                        fontWeight: "600"
                                    }}>
                                        {
                                            p.__product__?.contents[language?.code].name
                                        }
                                    </Text>
                                </View>
                                <View style={{ width: 192 }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                        fontFamily: config.fontFamily,
                                        textAlign: "right", fontSize: theme.confirmation.nestedItem.price.textFontSize,
                                        color: theme.confirmation.nestedItem.price.textColor, fontWeight: "600"
                                    }}>
                                        {
                                            `${p.quantity}x${p.getFormatedPrice(true)}`
                                        }
                                    </Text>
                                </View>
                            </View>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ width: 144, height: 44 }}>
                <NumericStapper
                    value={position.quantity}
                    buttonStyle={{
                        width: 44, height: 44, borderRadius: 16,
                        backgroundColor: theme.confirmation.item.quantityStepper.buttons.backgroundColor,
                        borderColor: theme.confirmation.item.quantityStepper.buttons.borderColor,
                        padding: 6
                    }}
                    disabledButtonStyle={{
                        width: 44, height: 44, borderRadius: 16,
                        backgroundColor: theme.confirmation.item.quantityStepper.buttons.disabledBackgroundColor,
                        borderColor: theme.confirmation.item.quantityStepper.buttons.disabledBorderColor,
                        padding: 6
                    }}
                    buttonTextStyle={{
                        fontSize: theme.confirmation.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                        color: theme.confirmation.item.quantityStepper.buttons.textColor as any,
                    }}
                    disabledButtonTextStyle={{
                        fontSize: theme.confirmation.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                        color: theme.confirmation.item.quantityStepper.buttons.disabledTextColor
                    }}
                    textStyle={{
                        width: 24, fontSize: theme.confirmation.item.quantityStepper.indicator.textFontSize, fontWeight: "600",
                        color: theme.confirmation.item.quantityStepper.indicator.textColor
                    }}
                    iconDecrement="-"
                    iconIncrement="+"
                    min={0}
                    max={Math.min(position.rests, 99)}
                    onChange={changeQuantityHandler}
                />
            </View>
        </View>
    );
})