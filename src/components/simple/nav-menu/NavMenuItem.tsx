import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICompiledMenuNode, NodeTypes, IProduct, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";

interface INavMenuItemProps {
    imageHeight: number;
    node: ICompiledMenuNode;
    currency: ICurrency;
    languageCode: string;
    onPress: (node: ICompiledMenuNode) => void;
}

export const NavMenuItem = ({ imageHeight, currency, languageCode, node, onPress }: INavMenuItemProps) => {

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }

    const currentContent = node.content?.contents[languageCode];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = node.type === NodeTypes.PRODUCT && (node.content as ICompiledProduct).tags?.length > 0 ? (node.content as ICompiledProduct).tags : undefined;

    return (
        <View style={{ flex: 1, /*backgroundColor: currentContent.color,*/ borderRadius: 16, padding: 22 }}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={pressHandler}>
                <View style={{ flex: 1, width: '100%', height: imageHeight, marginBottom: 5, justifyContent: 'flex-end' }}>
                    <Image style={{ width: '100%', height: '100%' }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode='contain' resizeMethod='scale'></Image>
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
                    {
                        currentContent.name
                    }
                </Text>
                <Text numberOfLines={3} ellipsizeMode='tail' style={{ fontSize: 10, color: 'rgba(0, 0, 0, 0.5)', marginBottom: 12 }}>
                    {
                        currentContent.description
                    }
                </Text>
                {
                    
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderColor: 'rgba(0, 0, 0, 0.5)', marginBottom: 12 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 8, paddingBottom: 8, paddingLeft: 14, paddingRight: 14 }}>
                                {
                                    node.type === NodeTypes.PRODUCT
                                    ?
                                    `${((node.content as ICompiledProduct).prices[currency.id as string]?.value * 0.01).toFixed(2)} ${currency.name}`
                                    :
                                    `min price: `
                                }
                            </Text>
                        </View>
                }
                {
                /*<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        tags?.map(tag =>
                            tag?.contents[languageCode]?.resources?.main?.mipmap?.x32
                                ?
                                <Image style={{ width: 16, height: 16 }} source={{
                                    uri: `file://${tag?.contents[languageCode]?.resources?.main?.mipmap?.x32}`,
                                }} resizeMode='contain' resizeMethod='scale'></Image>
                                :
                            <View key={tag.id} style={{ width: 8, height: 8, marginRight: 2, backgroundColor: tag?.contents[languageCode]?.color, borderRadius: 4 }}></View>
                        )
                    }
                </View>*/
                }
            </TouchableOpacity>
        </View>
    );
}