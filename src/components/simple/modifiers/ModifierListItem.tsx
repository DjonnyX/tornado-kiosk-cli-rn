import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { NumericStapper } from "../NumericStapper";
import { IPositionWizard } from "../../../core/interfaces";
import { TagList } from "../TagList";

interface IModifierListItemProps {
    stateId: number;
    thumbnailHeight: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const ModifierListItem = React.memo(({ thumbnailHeight, currency, language, position, stateId }: IModifierListItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        const hasEdit = position.edit();
        if (!hasEdit && position.quantity < position.availableQuantitiy) {
            position.quantity++;
        }
    }, []);

    const changeQuantityHandler = (qnt: number) => {
        position.quantity = qnt;
    }

    const currentContent = position.__product__?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = !!position.__product__?.tags && position.__product__?.tags?.length > 0
        ? position.__product__?.tags
        : undefined;

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].modifiers.item.backgroundColor, borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={pressHandler}>
                {
                    !!tags &&
                    <TagList tags={tags} language={language} />
                }
                <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5 }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail"
                    style={{
                        textAlign: "center", fontSize: 20, marginBottom: 6, color: theme.themes[theme.name].modifiers.item.nameColor,
                        fontWeight: "bold", textTransform: "uppercase"
                    }}>
                    {
                        currentContent?.name
                    }
                </Text>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                    textAlign: "center", fontSize: 12,
                    color: theme.themes[theme.name].modifiers.item.descriptionColor, textTransform: "uppercase",
                    marginBottom: 12
                }}>
                    {
                        currentContent?.description
                    }
                </Text>
            </TouchableOpacity>
            <NumericStapper
                value={position.quantity}
                buttonStyle={{
                    width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 4,
                    backgroundColor: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.backgroundColor,
                    borderColor: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.borderColor,
                    padding: 6
                }}
                disabledButtonStyle={{
                    width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 4,
                    backgroundColor: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledBackgroundColor,
                    borderColor: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledBorderColor,
                    padding: 6,
                    opacity: 0.25
                }}
                disabledSelectedButtonStyle={{
                    width: 48, height: 48, borderRadius: 6,
                    backgroundColor: "#30a02a", //theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledBackgroundColor,
                    padding: 6,
                    opacity: 0.25
                }}
                buttonSelectedStyle={{
                    width: 48, height: 48, borderRadius: 6,
                    backgroundColor: "#30a02a", //theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledBackgroundColor,
                    padding: 6,
                    opacity: 1
                }}
                buttonTextStyle={{
                    color: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.textColor as any,
                }}
                buttonSelectedTextStyle={{
                    color: "white", //theme.themes[theme.name].modifiers.item.quantityStepper.buttons.textColor as any,
                }}
                disabledButtonTextStyle={{
                    color: theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledTextColor as any,
                }}
                disabledSelectedButtonTextStyle={{
                    color: "rgba(255, 255, 255, 0.25)", //theme.themes[theme.name].modifiers.item.quantityStepper.buttons.disabledTextColor as any,
                }}
                textStyle={{ color: theme.themes[theme.name].modifiers.item.quantityStepper.indicator.textColor }}
                iconDecrement="-"
                iconIncrement="+"
                onChange={changeQuantityHandler}
                formatValueFunction={(value: number) => {
                    return position.sum > 0
                        ? `${String(value)}x${position.getFormatedSumPerOne(true)}`
                        : String(position.getFormatedSumPerOne(true));
                }}
                min={position.downLimit}
                max={position.availableQuantitiy}
            />
        </View>
    );
});