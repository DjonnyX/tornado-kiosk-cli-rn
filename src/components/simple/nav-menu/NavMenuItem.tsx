import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICompiledMenuNode, NodeTypes, ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { priceFormatter } from "../../../utils/price";
import { TagList } from "../TagList";

interface INavMenuItemProps {
    thumbnailHeight: number;
    node: ICompiledMenuNode;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: ICompiledMenuNode) => void;
}

export const NavMenuItem = React.memo(({ thumbnailHeight, currency, language, node, onPress }: INavMenuItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }, []);

    const currentContent = node.content?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = node.type === NodeTypes.PRODUCT && (node.content as ICompiledProduct).tags?.length > 0 ? (node.content as ICompiledProduct).tags : undefined;

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].menu.navMenu.item.backgroundColor, /*backgroundColor: Color.rgb(currentContent.color).alpha(0.05).toString(),*/ borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={pressHandler}>
                {
                    !!tags &&
                    <TagList tags={tags} language={language} />
                }
                <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5 }} renderToHardwareTextureAndroid={true}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{ textAlign: "center", fontSize: 20, marginBottom: 6, color: theme.themes[theme.name].menu.navMenu.item.nameColor, fontWeight: "bold", textTransform: "uppercase" }}>
                    {
                        currentContent.name
                    }
                </Text>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{ textAlign: "center", fontSize: 10, color: theme.themes[theme.name].menu.navMenu.item.descriptionColor, textTransform: "uppercase", marginBottom: 12 }}>
                    {
                        currentContent.description
                    }
                </Text>
                {
                    node.type === NodeTypes.PRODUCT
                        ?
                        <View style={{ borderStyle: "solid", borderWidth: 0.5, borderRadius: 5, alignItems: "center", justifyContent: "center", borderColor: theme.themes[theme.name].menu.navMenu.item.price.borderColor, marginBottom: 12 }}>
                            <Text style={{ textAlign: "center", fontSize: 16, paddingTop: 6, paddingBottom: 6, paddingLeft: 14, paddingRight: 14, color: theme.themes[theme.name].menu.navMenu.item.price.textColor }}>
                                {
                                    `${priceFormatter((node.content as ICompiledProduct).prices[currency.id as string]?.value)} ${currency.symbol}`
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