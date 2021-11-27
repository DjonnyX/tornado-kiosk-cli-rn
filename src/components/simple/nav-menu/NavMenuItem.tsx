import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { NodeTypes, ICompiledProduct, ICurrency, ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { TagList } from "../TagList";
import { MenuNode } from "../../../core/menu/MenuNode";
import { IOrderWizard } from "../../../core/interfaces";
import { config } from "../../../Config";

interface INavMenuItemProps {
    theme: IKioskThemeData;
    thumbnailHeight: number;
    orderStateId: number;
    orderWizard: IOrderWizard;
    node: MenuNode;
    stateId: number;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: MenuNode) => void;
}

export const NavMenuItem = React.memo(({ theme, thumbnailHeight, orderWizard, orderStateId, currency, language, node, stateId,
    onPress }: INavMenuItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }, []);

    const parentNode = node.parent;
    const parentContent = parentNode?.__rawNode__?.content?.contents[language?.code];

    const currentContent = node.__rawNode__.content?.contents[language?.code];
    const currentAsset = currentContent?.resources?.icon;

    const tags = node.type === NodeTypes.PRODUCT && (node.__rawNode__.content as ICompiledProduct).tags?.length > 0
        ? (node.__rawNode__.content as ICompiledProduct).tags
        : undefined;

    const isSelected = orderWizard.contains(node);

    return (
        <View style={{
            flex: 1, backgroundColor: theme.menu.navMenu.item.backgroundColor,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? parentContent?.color : theme.menu.navMenu.item.borderColor,
            borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10,
        }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={pressHandler}>
                <View style={{ alignItems: "center", flex: 1, width: "100%" }}>
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
                            node.type === NodeTypes.PRODUCT && node.discount < 0 &&
                            <View style={{
                                width: "auto",
                                position: "absolute",
                            }}>
                                <Text style={{
                                    fontFamily: config.fontFamily,
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    fontSize: theme.modifiers.item.discount.textFontSize,
                                    fontWeight: "600",
                                    backgroundColor: theme.menu.navMenu.item.discount.backgroundColor,
                                    color: theme.menu.navMenu.item.discount.textColor,
                                }}>
                                    {
                                        node.getFormatedDiscount(true)
                                    }
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={{ width: "100%", }}>
                        <View style={{ width: "100%", height: thumbnailHeight, flex: 1, alignItems: "center", marginBottom: 5 }}>
                            <View style={{}}>
                                <FastImage style={{ width: thumbnailHeight, height: thumbnailHeight, borderRadius: 16, overflow: "hidden" }} source={{
                                    uri: `file://${currentAsset?.mipmap?.x128}`,
                                }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                            </View>
                        </View>
                        <Text textBreakStrategy="simple" numberOfLines={4} ellipsizeMode="tail" style={{
                            fontFamily: config.fontFamily,
                            width: "100%",
                            textAlign: node.type === NodeTypes.PRODUCT ? "left" : "center",
                            fontSize: theme.menu.navMenu.item.nameFontSize,
                            letterSpacing: 0.4,
                            lineHeight: theme.menu.navMenu.item.nameFontSize * 1.5, marginBottom: 6, fontWeight: "500",
                            color: theme.menu.navMenu.item.nameColor,
                        }}>
                            {
                                currentContent.name
                            }
                        </Text>
                        <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                            fontFamily: config.fontFamily,
                            width: "100%",
                            textAlign: node.type === NodeTypes.PRODUCT ? "left" : "center",
                            fontWeight: "400",
                            letterSpacing: 0.4,
                            lineHeight: theme.menu.navMenu.item.descriptionFontSize * 1.6,
                            fontSize: theme.menu.navMenu.item.descriptionFontSize,
                            color: theme.menu.navMenu.item.descriptionColor,
                            marginBottom: 12
                        }}>
                            {
                                currentContent.description
                            }
                        </Text>
                    </View>
                </View>
                {
                    node.type === NodeTypes.PRODUCT
                        ?
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            borderStyle: "solid", alignItems: "flex-end", justifyContent: "center",
                            //borderColor: theme.menu.navMenu.item.price.borderColor, borderWidth: 0.5, borderRadius: 5, 
                            marginBottom: 12
                        }}>
                            <Text style={{
                                fontFamily: config.fontFamily,
                                flex: 1,
                                textAlign: "left",
                                fontSize: theme.menu.navMenu.item.price.textFontSize,
                                paddingRight: 14,
                                color: theme.menu.navMenu.item.price.textColor
                            }}>
                                {
                                    node.getFormatedPrice(true)
                                }
                            </Text>
                            <Text style={{
                                fontFamily: config.fontFamily,
                                flex: 1,
                                textAlign: "right", fontSize: theme.menu.navMenu.item.price.textFontSize,
                                paddingRight: 14, color: theme.menu.navMenu.item.price.textColor
                            }}>
                                {
                                    node.getPortion()
                                }
                            </Text>
                        </View>
                        :
                        undefined
                }
            </TouchableOpacity>
        </View>
    );
});