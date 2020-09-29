import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICompiledMenu, ICompiledMenuNode, NodeTypes } from "@djonnyx/tornado-types";

interface ISideMenuItemProps {
    node: ICompiledMenuNode;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = ({ languageCode, node, onPress }: ISideMenuItemProps) => {

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }

    const currentContent = node.content?.contents[languageCode];
    const currentAdAsset = currentContent?.resources?.icon;

    return (
        <View style={{ flex: 1, marginBottom: 20, padding: 10, borderRadius: 4, backgroundColor: currentContent.color }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} onPress={pressHandler}>
                <Image style={{ width: '100%', height: 128, marginBottom: 5 }} source={{
                    uri: `file://${currentAdAsset?.path}`,
                }} resizeMode='contain' resizeMethod='scale'></Image>
                <Text>
                    {
                        currentContent.name
                    }
                </Text>
            </TouchableOpacity>
            {
                node.children.filter(child => child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE).map(child =>
                    <SideMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></SideMenuItem>
                )
            }
        </View>
    );
}