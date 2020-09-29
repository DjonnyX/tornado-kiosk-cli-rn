import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import * as Color from "color";
import { ICompiledMenuNode, NodeTypes } from "@djonnyx/tornado-types";

interface ISideMenuItemProps {
    node: ICompiledMenuNode;
    selected: ICompiledMenuNode;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = ({ selected, languageCode, node, onPress }: ISideMenuItemProps) => {

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }

    const currentContent = node.content?.contents[languageCode];
    const currentAdAsset = currentContent?.resources?.icon;

    return (
        <View style={{
            flex: 1, marginBottom: 10, padding: 10, borderRadius: 24,
            backgroundColor: node === selected ? Color.rgb(currentContent.color).alpha(0.5).toString() : Color.rgb(currentContent.color).alpha(0.1).toString()
        }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} onPress={pressHandler}>
                <Image style={{ width: '100%', height: 64, marginBottom: 5 }} source={{
                    uri: `file://${currentAdAsset?.mipmap.x128}`,
                }} resizeMode='contain' resizeMethod='scale'></Image>
                <Text>
                    {
                        currentContent.name
                    }
                </Text>
            </TouchableOpacity>
            {
                node.children.filter(child => child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE).map(child =>
                    <SideMenuItem key={child.id} node={child} selected={selected} languageCode={languageCode} onPress={onPress}></SideMenuItem>
                )
            }
        </View>
    );
}