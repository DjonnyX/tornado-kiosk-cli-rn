import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { theme } from "../../../theme";
import { IPositionWizard } from "../../../core/interfaces";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { IAlertState } from "../../../interfaces";

interface ConfirmationOrderListItemProps {
    stateId: number;
    imageHeight: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
    alertOpen: (alert: IAlertState) => void;
}

export const ConfirmationOrderListItem = React.memo(({ stateId, imageHeight, currency, language, position,
    alertOpen }: ConfirmationOrderListItemProps) => {
    const currentContent = position.__product__?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        position.edit();
    }, []);

    const setQuantity = (qnt: number) => {
        position.quantity = qnt;
    }

    const changeQuantityHandler = (value: number) => {
        if (value < 1) {
            alertOpen({
                title: "Внимание!", message: "Вы действительно хотите удалить позицию?", buttons: [
                    {
                        title: "Удалить",
                        action: () => {
                            OrderWizard.current.remove(position);
                        }
                    },
                    {
                        title: "Отмена",
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
        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 24, paddingRight: 24, marginBottom: 20 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={pressHandler}>
                <View style={{ width: 64, height: imageHeight, marginRight: 20, justifyContent: "flex-end" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <View style={{ flex: 1, marginTop: 8 }}>
                    <View style={{ flexDirection: "row", marginRight: 20, alignItems: "flex-start" }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={3} ellipsizeMode="tail" style={{
                                textAlign: "left", fontSize: 20,
                                color: theme.themes[theme.name].menu.draftOrder.item.nameColor, textTransform: "uppercase", fontWeight: "bold"
                            }}>
                                {
                                    currentContent?.name
                                }
                            </Text>
                        </View>
                        <View style={{ width: 192 }}>
                            <Text style={{
                                textAlign: "right", fontSize: 24,
                                color: theme.themes[theme.name].menu.draftOrder.item.nameColor, fontWeight: "bold"
                            }}>
                                {
                                    `${position.quantity}x${position.getFormatedSumPerOne(true)}`
                                }
                            </Text>
                        </View>
                    </View>
                    {
                        position.nestedPositions.map(p => <View style={{ flexDirection: "row", marginRight: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                    textAlign: "left", fontSize: 12,
                                    color: "green", textTransform: "uppercase", fontWeight: "bold"
                                }}>
                                    {
                                        p.__product__?.contents[language?.code].name
                                    }
                                </Text>
                            </View>
                            <View style={{ width: 192 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                    textAlign: "right", fontSize: 12,
                                    color: "green", fontWeight: "bold"
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
            </TouchableOpacity>
            <View style={{ width: 144, height: 44 }}>
                <NumericStapper
                    value={position.quantity}
                    buttonStyle={{
                        width: 44, height: 44, borderStyle: "solid", borderWidth: 0.5, borderRadius: 3,
                        borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.borderColor,
                        padding: 6
                    }}
                    buttonTextStyle={{
                        color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textColor as any,
                    }}
                    textStyle={{ width: 44, color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textColor }}
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