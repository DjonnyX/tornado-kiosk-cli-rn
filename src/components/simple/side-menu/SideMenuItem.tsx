import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICompiledMenu, ICompiledMenuNode, NodeTypes } from "@djonnyx/tornado-types";

interface ISideMenuItemProps {
    node: ICompiledMenuNode;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = ({ languageCode, node, onPress }: ISideMenuItemProps) => {
    /*const [currentAdIndex, _setCurrentAdIndex] = useState(0);

    const nextCurrentAdIndex = () => {
        _setCurrentAdIndex(prevAdIndex => {
            if (prevAdIndex + 1 > ads.length - 1) {
                prevAdIndex = 0;
            } else {
                prevAdIndex += 1;
            }
            return prevAdIndex;
        });
    };

    const updateTimerOfDuration = (duration = 0) => {
        if (duration > 0) {
            setTimeout(nextCurrentAdIndex, duration * 1000);
        }
    };

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(ads[currentAdIndex]);
        }
    }

    const endVideoHandler = () => {
        nextCurrentAdIndex();
    }

    const currentAdContent = !!ads && ads.length > 0 ? ads[currentAdIndex].contents[languageCode] : undefined;
    const currentAdAsset = currentAdContent?.resources?.main;

    const isVideo = currentAdAsset?.ext === '.mp4';

    if (!isVideo) {
        updateTimerOfDuration(currentAdContent?.duration || 0);
    }*/

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
                    <SideMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></SideMenuItem>
                )
            }
        </View>
    );
}