import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { theme } from "../../../theme";
import { IPositionWizard } from "../../../core/interfaces";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { IAlertState } from "../../../interfaces";
import { localize } from "../../../utils/localization";

interface IMyOrderListItemItemProps {
    stateId: number;
    menuStateId: number;
    imageHeight: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
    alertOpen: (alert: IAlertState) => void;
}

export const MyOrderListItem = React.memo(({ stateId, menuStateId, imageHeight, currency, language, position,
    alertOpen }: IMyOrderListItemItemProps) => {
    const currentContent = position.__product__?.contents[language?.code];
    const currentAsset = currentContent?.resources?.icon;

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        position.edit();
    }, []);

    const setQuantity = useCallback((qnt: number) => {
        position.quantity = qnt;
    }, [stateId]);

    const changeQuantityHandler = useCallback((value: number) => {
        if (value < 1) {
            alertOpen({
                title: localize(language, "kiosk_remove_product_title"),
                message: localize(language, "kiosk_remove_product_message"),
                buttons: [
                    {
                        title: localize(language, "kiosk_remove_product_button_accept"),
                        action: () => {
                            OrderWizard.current.remove(position);
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
    }, [stateId]);

    return (
        <View style={{ flex: 1, paddingLeft: 24, paddingRight: 24, marginBottom: 20 }}>
            {/* <TouchableOpacity style={{ alignItems: "center" }} onPress={pressHandler}> */}
                {/* <View style={{ flex: 1, width: "100%", height: imageHeight, marginBottom: 2, justifyContent: "flex-end" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAsset?.mipmap?.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View> */}
                <Text numberOfLines={3} ellipsizeMode="tail" style={{
                    textAlign: "left", fontSize: theme.themes[theme.name].menu.draftOrder.item.nameFontSize, fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.nameColor, textTransform: "uppercase"
                }}>
                    {
                        currentContent?.name
                    }
                </Text>
                <View style={{ marginBottom: 1 }}>
                    <Text style={{
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: theme.themes[theme.name].menu.draftOrder.item.price.textFontSize,
                        paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6,
                        color: theme.themes[theme.name].menu.draftOrder.item.price.textColor
                    }}>
                        {
                            `${position.quantity} x ${position.getFormatedSumPerOne(true)}`
                        }
                    </Text>
                </View>
            {/* </TouchableOpacity> */}
            {/* <NumericStapper
                key={language.code}
                value={position.quantity}
                animationOnInit={true}
                buttonStyle={{
                    width: 38, height: 38, borderRadius: 10,
                    backgroundColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.backgroundColor,
                    borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.borderColor,
                    padding: 6
                }}
                disabledButtonStyle={{
                    width: 38, height: 38, borderRadius: 10,
                    backgroundColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledBackgroundColor,
                    borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledBorderColor,
                    padding: 6
                }}
                buttonTextStyle={{
                    fontWeight: "bold",
                    fontSize: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textFontSize,
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textColor as any,
                }}
                disabledButtonTextStyle={{
                    fontWeight: "bold",
                    fontSize: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textFontSize,
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledTextColor as any,
                }}
                textStyle={{
                    width: 44,
                    fontSize: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textFontSize, fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textColor
                }}
                iconDecrement="-"
                iconIncrement="+"
                min={0}
                max={Math.min(position.rests, 99)}
                onChange={changeQuantityHandler}
            /> */}
        </View>
    );
})