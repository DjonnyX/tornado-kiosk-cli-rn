import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { IPositionWizard } from "../../../core/interfaces";
import { TagList } from "../TagList";
import { Switch } from "../Switch";

interface IModifierListItemProps {
    theme: IKioskThemeData;
    stateId: number;
    thumbnailHeight: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const ModifierListItem = React.memo(({ theme, thumbnailHeight, currency, language, position, stateId }: IModifierListItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        const hasEdit = position.edit();
        if (!hasEdit) {
            if (position.isReplacement) {
                position.quantity = 1;
            } else if (position.quantity < position.availableQuantitiy) {
                position.quantity++;
            }
        }
    }, []);

    const changeQuantityHandler = (qnt: number | boolean) => {
        position.quantity = Number(qnt);
    }

    const currentContent = position.__product__?.contents[language?.code];
    const currentAsset = currentContent?.resources?.icon;

    const tags = !!position.__product__?.tags && position.__product__?.tags?.length > 0
        ? position.__product__?.tags
        : undefined;

    return (
        <View style={{ flex: 1, backgroundColor: theme.modifiers.item.backgroundColor, borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={pressHandler}>
                <View style={{
                    flexDirection: "row", alignItems: "baseline", justifyContent: !!tags ? "space-around" : "flex-end",
                    width: "100%", position: "relative",
                }}>
                    {
                        !!tags &&
                        <View style={{ position: "absolute", left: 0, right: 0, flex: 1, zIndex: 1 }}>
                            <TagList theme={theme} tags={tags} language={language} />
                        </View>
                    }
                    {
                        position.discountPerOne < 0 &&
                        <View style={{
                            width: "auto"
                        }}>
                            <Text style={{
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                fontSize: theme.modifiers.item.discount.textFontSize, fontWeight: "bold",
                                backgroundColor: theme.modifiers.item.discount.backgroundColor,
                                color: theme.modifiers.item.discount.textColor,
                            }}>
                                {
                                    position.getFormatedDiscountPerOne(true)
                                }
                            </Text>
                        </View>
                    }
                </View>
                <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5, flex: 1, alignItems: "center" }}>
                    <FastImage style={{ width: thumbnailHeight, height: thumbnailHeight, borderRadius: 16, overflow: "hidden" }} source={{
                        uri: `file://${currentAsset?.mipmap?.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail"
                    style={{
                        textAlign: "center", fontSize: theme.modifiers.item.nameFontFontSize, marginBottom: 6, color: theme.modifiers.item.nameColor,
                        fontWeight: "bold", textTransform: "uppercase"
                    }}>
                    {
                        currentContent?.name
                    }
                </Text>
                {/* <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                    textAlign: "center", fontSize: theme.modifiers.item.descriptionFontSize,
                    color: theme.modifiers.item.descriptionColor, textTransform: "uppercase",
                    marginBottom: 12
                }}>
                    {
                        currentContent?.description
                    }
                </Text> */}
            </TouchableOpacity>
            {
                position.isReplacement
                    ?
                    <Switch
                        value={Boolean(position.quantity)}
                        onChange={changeQuantityHandler}
                        styleOn={{
                            borderStyle: "solid", borderWidth: 0, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantitySwitch.on.backgroundColor,
                            borderColor: theme.modifiers.item.quantitySwitch.on.borderColor,
                            padding: 6
                        }}
                        styleOff={{
                            borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantitySwitch.off.backgroundColor,
                            borderColor: theme.modifiers.item.quantitySwitch.off.borderColor,
                            padding: 6,
                            opacity: 0.25
                        }}
                        styleViewOn={{}}
                        styleViewOff={{}}
                        textStyleOn={{
                            fontSize: theme.modifiers.item.quantitySwitch.on.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantitySwitch.on.textColor,
                        }}
                        textStyleOff={{
                            fontSize: theme.modifiers.item.quantitySwitch.off.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantitySwitch.off.textColor,
                        }}
                        textStyleOnDisabled={{}}
                        textStyleOffDisabled={{}}
                        formatValueFunction={(value: boolean) => {
                            return String(position.getFormatedSumPerOne(true));
                        }} />
                    :
                    <NumericStapper
                        value={position.quantity}
                        buttonStyle={{
                            width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantityStepper.buttons.backgroundColor,
                            borderColor: theme.modifiers.item.quantityStepper.buttons.borderColor,
                            padding: 6
                        }}
                        buttonSelectedStyle={{
                            width: 48, height: 48, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantityStepper.buttons.selectedBackgroundColor,
                            borderColor: theme.modifiers.item.quantityStepper.buttons.selectedBackgroundColor,
                            padding: 6,
                            opacity: 1
                        }}
                        disabledButtonStyle={{
                            width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantityStepper.buttons.disabledBackgroundColor,
                            borderColor: theme.modifiers.item.quantityStepper.buttons.disabledBorderColor,
                            padding: 6,
                            opacity: 0.25
                        }}
                        disabledSelectedButtonStyle={{
                            width: 48, height: 48, borderRadius: 16,
                            backgroundColor: theme.modifiers.item.quantityStepper.buttons.disabledSelectedBackgroundColor,
                            borderColor: theme.modifiers.item.quantityStepper.buttons.disabledSelectedBorderColor,
                            padding: 6,
                            opacity: 0.25
                        }}
                        buttonTextStyle={{
                            fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantityStepper.buttons.textColor as any,
                        }}
                        buttonSelectedTextStyle={{
                            fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantityStepper.buttons.selectedTextColor as any,
                        }}
                        disabledButtonTextStyle={{
                            fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantityStepper.buttons.disabledTextColor as any,
                        }}
                        disabledSelectedButtonTextStyle={{
                            fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantityStepper.buttons.disabledSelectedTextColor as any,
                        }}
                        textStyle={{
                            fontSize: theme.modifiers.item.quantityStepper.indicator.textFontSize, fontWeight: "bold",
                            color: theme.modifiers.item.quantityStepper.indicator.textColor
                        }}
                        iconDecrement="-"
                        iconIncrement="+"
                        onChange={changeQuantityHandler}
                        formatValueFunction={(value: number) => {
                            return value > 0
                                ? `${String(value)} x ${position.getFormatedSumPerOne(true)}`
                                : String(position.getFormatedSumPerOne(true));
                        }}
                        min={position.downLimit}
                        max={position.availableQuantitiy}
                    />
            }
        </View>
    );
});