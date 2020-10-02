import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, LayoutChangeEvent, Animated, Easing } from "react-native";
import * as Color from "color";
import FastImage from "react-native-fast-image";
import { ICompiledMenuNode, NodeTypes, ICompiledLanguage } from "@djonnyx/tornado-types";

interface ISideMenuItemProps {
    depth?: number;
    height?: number;
    node: ICompiledMenuNode;
    selected: ICompiledMenuNode;
    language: ICompiledLanguage;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = React.memo(({ depth = 0, height = 0, selected, language, node, onPress }: ISideMenuItemProps) => {
    const [bound, _setBound] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [subMenuSize, _setSubMenuSize] = useState(new Animated.Value(1));
    let subMenuSizeAnimation: Animated.CompositeAnimation;

    const onLayout = (event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;

        // выставляется только при инициализации
        // если будут ещё вложенные элементы, то придется это отключить
        if (!(width && height)) {
            _setBound(prevBound => ({ x, y, width, height }));
        }
    }

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }, []);

    const expand = () => {
        if (subMenuSizeAnimation) {
            subMenuSizeAnimation.stop();
        }
        subMenuSizeAnimation = Animated.timing(subMenuSize, {
            useNativeDriver: false,
            toValue: 1,
            duration: 500,
            easing: Easing.cubic,
            delay: 1,
        });
        subMenuSizeAnimation.start();
    };

    const collapse = () => {
        if (subMenuSizeAnimation) {
            subMenuSizeAnimation.stop();
        }
        subMenuSizeAnimation = Animated.timing(subMenuSize, {
            useNativeDriver: false,
            toValue: 0,
            duration: 500,
            easing: Easing.cubic,
            delay: 1,
        });
        subMenuSizeAnimation.start();
    };

    const currentContent = node.content?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;
    const color = "rgba(0, 0, 0, 0)"; //currentContent.color;
    const isExpanded = node === selected || node.children.filter(child => child === selected).length > 0;

    if (isExpanded) {
        expand();
    } else {
        collapse();
    }

    const children = node.children.filter(child => child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE);
    const subItemHwight = 92 - 12 * depth;

    return (
        <View style={{ flex: 1, minHeight: height }} renderToHardwareTextureAndroid={true}>
            <View style={{
                flex: 1,
                margin: 8 * depth, marginBottom: depth === 0 ? 5 : 4, marginTop: depth === 0 ? 5 : 0, padding: 8, borderRadius: 24,
                backgroundColor: node === selected ? Color.rgb(color).alpha(0.15).toString() : Color.rgb(color).alpha(0.025 + 0.025 * depth).toString(),
                overflow: "hidden"
            }}>
                <TouchableOpacity style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }} onPress={pressHandler}>
                    <FastImage style={{ width: "100%", height: 64 - 12 * depth, marginBottom: 5 }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                    <Text style={{ fontSize: 11 }}>
                        {
                            currentContent.name
                        }
                    </Text>
                </TouchableOpacity>
            </View>
            {
                children.length > 0
                    ?
                    <Animated.View style={{
                        width: "100%",
                        height: subMenuSize.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, children.length * subItemHwight],
                        }),
                        overflow: "hidden"
                    }}>
                        <View style={{ display: "flex", height: "100%" }} onLayout={onLayout}>
                            {
                                children.map(child =>
                                    <SideMenuItem key={child.id} depth={depth + 1} height={subItemHwight} node={child} selected={selected} language={language} onPress={onPress}></SideMenuItem>
                                )
                            }
                        </View>
                    </Animated.View>
                    :
                    undefined
            }
        </View>
    );
})