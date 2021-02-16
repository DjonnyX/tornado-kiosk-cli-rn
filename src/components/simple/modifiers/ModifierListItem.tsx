import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICompiledMenuNode, NodeTypes, ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { NumericStapper } from "../NumericStapper";
import { IPositionWizardPosition } from "../../../core/interfaces";

interface IModifierListItemProps {
    stateId: number;
    thumbnailHeight: number;
    position: IPositionWizardPosition;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (position: IPositionWizardPosition) => void;
}

export const ModifierListItem = React.memo(({ thumbnailHeight, currency, language, position, stateId,
    onPress }: IModifierListItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(position);
        }
    }, []);

    const changeQuantityHandler = (qnt: number) => {
        position.quantity = qnt;
    }

    const currentContent = position.__productNode__.content?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = position.__productNode__.type === NodeTypes.PRODUCT && position.__productNode__.content.tags?.length > 0
        ? position.__productNode__.content.tags
        : undefined;

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].menu.navMenu.item.backgroundColor, /*backgroundColor: Color.rgb(currentContent.color).alpha(0.05).toString(),*/ borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={pressHandler}>
                <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5 }} renderToHardwareTextureAndroid={true}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.path}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail"
                    style={{
                        textAlign: "center", fontSize: 20, marginBottom: 6, color: theme.themes[theme.name].menu.navMenu.item.nameColor,
                        fontWeight: "bold", textTransform: "uppercase"
                    }}>
                    {
                        currentContent.name
                    }
                </Text>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                    textAlign: "center", fontSize: 10,
                    color: theme.themes[theme.name].menu.navMenu.item.descriptionColor, textTransform: "uppercase",
                    marginBottom: 12
                }}>
                    {
                        currentContent.description
                    }
                </Text>
                <NumericStapper
                    value={position.quantity}
                    buttonStyle={{
                        width: 48, height: 48, borderStyle: "solid", borderWidth: 0.5, borderRadius: 3,
                        borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.borderColor,
                        padding: 6
                    }}
                    buttonTextStyle={{
                        color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textColor as any,
                    }}
                    textStyle={{ color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textColor }}
                    iconDecrement="-"
                    iconIncrement="+"
                    onChange={changeQuantityHandler}
                    formatValueFunction={(value: number) => {
                        return position.sum > 0
                            ? `${String(value)}x${position.getFormatedPrice(true)}`
                            : String(position.getFormatedPrice(true));
                    }}
                    min={0}
                    max={Math.min(position.availableQuantitiy, 99)}
                />
            </TouchableOpacity>
        </View>
    );
});