import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICompiledMenuNode, NodeTypes, ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";

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
        <View style={{ flex: 1, /*backgroundColor: Color.rgb(currentContent.color).alpha(0.05).toString(),*/ borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={pressHandler}>
                <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5 }} renderToHardwareTextureAndroid={true}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.path}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{ textAlign: "center", fontFamily: "RobotoSlab-Black", fontSize: 20, marginBottom: 6, color: "rgba(0, 0, 0, 0.75)" }}>
                    {
                        currentContent.name
                    }
                </Text>
                <Text textBreakStrategy="simple" numberOfLines={3} ellipsizeMode="tail" style={{ textAlign: "center", fontSize: 10, color: "rgba(0, 0, 0, 0.5)", marginBottom: 12 }}>
                    {
                        currentContent.description
                    }
                </Text>
                {

                    node.type === NodeTypes.PRODUCT
                        ?
                        <View style={{ borderStyle: "solid", borderWidth: 0.5, borderRadius: 6, alignItems: "center", justifyContent: "center", borderColor: "rgba(0, 0, 0, 0.5)", marginBottom: 12 }}>
                            <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", paddingTop: 8, paddingBottom: 8, paddingLeft: 14, paddingRight: 14, color: "rgba(0, 0, 0, 0.75)" }}>
                                {
                                    `${((node.content as ICompiledProduct).prices[currency.id as string]?.value * 0.01).toFixed(2)} ${currency.symbol}`
                                }
                            </Text>
                        </View>
                        :
                        undefined
                }
                {
                    /*<View style={{ position: "absolute", flexDirection: "row", flexWrap: "wrap" }}>
                        {
                            tags?.map(tag =>
                                tag?.contents[language.code]?.resources?.main?.mipmap?.x32
                                    ?
                                    <Image style={{ width: 16, height: 16 }} source={{
                                        uri: `file://${tag?.contents[language.code]?.resources?.main?.mipmap?.x32}`,
                                    }} resizeMode="contain" resizeMethod="scale"></Image>
                                    :
                                <View key={tag.id} style={{ width: 8, height: 8, marginRight: 2, backgroundColor: tag?.contents[language.code]?.color, borderRadius: 4 }}></View>
                            )
                        }
                    </View>*/
                }
            </TouchableOpacity>
        </View>
    );
});