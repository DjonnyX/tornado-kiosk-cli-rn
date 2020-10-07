import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, LayoutChangeEvent, Animated, Easing } from "react-native";
import * as Color from "color";
import FastImage from "react-native-fast-image";
import { ICompiledMenuNode, NodeTypes, ICompiledLanguage } from "@djonnyx/tornado-types";

const getSelectedDepth = (node: ICompiledMenuNode, selected: ICompiledMenuNode, depth: number = 0): number => {
    let result = -1;
    depth++;

    for (const child of node.children) {
        if (child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE) {
            if (node === selected || child === selected) {
                result = depth;
                return result;
            } else {
                const selectedDepth = getSelectedDepth(child, selected);
                if (selectedDepth > -1) {
                    result = selectedDepth;
                    return result;
                }
            }
        }
    }

    return result;
}

const getAllChildren = (node: ICompiledMenuNode, selected: ICompiledMenuNode, selectedDepth: number, depth: number = 0): Array<ICompiledMenuNode> => {
    const children = new Array<ICompiledMenuNode>();
    depth++;

    for (const child of node.children) {
        if (child.type === NodeTypes.SELECTOR || child.type === NodeTypes.SELECTOR_NODE) {
            if (selectedDepth >= depth || node === selected || child === selected) {
                children.push(child);

                if (selectedDepth > depth || child === selected) {
                    const subChildren = getAllChildren(child, selected, selectedDepth, depth);
                    children.push(...subChildren);
                }
            }
        }
    }

    return children;
}

const getChainChildren = (node: ICompiledMenuNode, selected: ICompiledMenuNode): Array<ICompiledMenuNode> => {
    const selectedDepth = getSelectedDepth(node, selected);
    const chainOfChildren = getAllChildren(node, selected, selectedDepth);

    return chainOfChildren;
}

interface ISideMenuItemProps {
    depth?: number;
    height?: number;
    node: ICompiledMenuNode;
    selected: ICompiledMenuNode;
    language: ICompiledLanguage;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenuItem = React.memo(({ depth = 0, height = 0, selected, language, node, onPress }: ISideMenuItemProps) => {
    const [itemHeight, _setItemHeight] = useState(0);
    const [subMenuSize, _setSubMenuSize] = useState(new Animated.Value(1));
    let subMenuSizeAnimation: Animated.CompositeAnimation;

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
            duration: 250,
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
            duration: 250,
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
    const allChainOfChildren = getChainChildren(node, selected);
    const size = depth > 0 ? 1 : 0;
    const invertSize = depth === 0 ? 1 : 0;
    const offset = 12 * size;
    const subItemHeight = 104 - offset;
    const mItemHeight = allChainOfChildren.length * subItemHeight;

    if (itemHeight !== mItemHeight) {
        _setItemHeight((prevItemHeight) => {
            const ratio = itemHeight / mItemHeight;
            let normalizeRatio = mItemHeight === 0 ? 0 : ratio;
            subMenuSize.setValue(normalizeRatio);
            return mItemHeight;
        });
    }

    return (
        <View style={{ flex: 1, alignContent: "flex-start", alignItems: "stretch", minHeight: height }}>
            <View style={{
                flex: 1,
                overflow: "hidden"
            }}>
                <TouchableOpacity style={{
                    flex: 1, justifyContent: "center", alignItems: "center",
                    margin: 8 * size, marginBottom: 4, marginTop: depth === 0 ? 5 : 0, padding: 8, borderRadius: 14,
                    backgroundColor: node === selected ? Color.rgb(color).alpha(0.15).toString() : Color.rgb(color).alpha(0.025).toString(),
                }} onPress={pressHandler}>
                    <FastImage style={{ width: "100%", height: 56 - offset, marginBottom: 5 }} source={{
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
                            outputRange: [0, itemHeight],
                        }),
                        overflow: "hidden"
                    }}>
                        <View style={{ display: "flex", height: "100%" }}>
                            {
                                // onLayout={layoutChangeHandler}
                                children.map(child =>
                                    <SideMenuItem key={child.id} depth={depth + 1} height={subItemHeight * (getChainChildren(child, selected).length + 1)} node={child} selected={selected} language={language} onPress={onPress}></SideMenuItem>
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