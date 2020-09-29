import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICompiledMenuNode, NodeTypes } from "@djonnyx/tornado-types";

interface INavMenuItemProps {
    node: ICompiledMenuNode;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const NavMenuItem = ({ languageCode, node, onPress }: INavMenuItemProps) => {

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }

    const currentContent = node.content?.contents[languageCode];
    const currentAdAsset = currentContent?.resources?.icon;

    return (
        <View style={{ flex: 1, marginBottom: 20 }}>
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
                    <NavMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></NavMenuItem>
                )
            }
        </View>
    );
}