import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import * as Color from "color";
import { ICompiledMenuNode, NodeTypes, ICompiledLanguage } from "@djonnyx/tornado-types";

interface ISideMenuItemProps {
    depth: number;
    node: ICompiledMenuNode;
    selected: ICompiledMenuNode;
    language: ICompiledLanguage;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = ({ depth = 0, selected, language, node, onPress }: ISideMenuItemProps) => {

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }

    const currentContent = node.content?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;
    const color = "rgba(0, 0, 0, 0)"; //currentContent.color;

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                margin: 8 * depth, marginBottom: depth === 0 ? 5 : 4, marginTop: depth === 0 ? 5 : 0, padding: 10, borderRadius: 24,
                backgroundColor: node === selected ? Color.rgb(color).alpha(0.15).toString() : Color.rgb(color).alpha(0.025 + 0.025 * depth).toString()
            }}>
                <TouchableOpacity style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }} onPress={pressHandler}>
                    <Image style={{ width: "100%", height: 64 - 16 * depth, marginBottom: 5 }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode="contain" resizeMethod="scale"></Image>
                    <Text style={{ fontSize: 11 }}>
                        {
                            currentContent.name
                        }
                    </Text>
                </TouchableOpacity>
            </View>
            {
                node === selected || node.children.filter(child => child === selected).length > 0
                ?
                node.children.filter(child => child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE).map(child =>
                    <SideMenuItem key={child.id} depth={depth + 1} node={child} selected={selected} language={language} onPress={onPress}></SideMenuItem>
                )
                :
                undefined
            }
        </View>
    );
}