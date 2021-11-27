import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, Animated, Easing } from "react-native";
import * as Color from "color";
import FastImage from "react-native-fast-image";
import { NodeTypes, ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { MenuNode } from "../../../core/menu/MenuNode";
import { config } from "../../../Config";

const getSelectedDepth = (node: MenuNode, selected: MenuNode, depth: number = 0): number => {
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

const getAllChildren = (node: MenuNode, selected: MenuNode, selectedDepth: number, depth: number = 0): Array<MenuNode> => {
    const children = new Array<MenuNode>();
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

const getChainChildren = (node: MenuNode, selected: MenuNode): Array<MenuNode> => {
    const selectedDepth = getSelectedDepth(node, selected);
    const chainOfChildren = getAllChildren(node, selected, selectedDepth);

    return chainOfChildren;
}

interface ISideMenuItemProps {
    theme: IKioskThemeData;
    depth?: number;
    height?: number;
    node: MenuNode;
    selected: MenuNode;
    language: ICompiledLanguage;
    onPress: (node: MenuNode) => void;
}

export const SideMenuItem = React.memo(({ theme, depth = 0, height = 0, selected, language, node,
    onPress }: ISideMenuItemProps) => {
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

    const currentContent = node.__rawNode__.content?.contents[language?.code];
    const currentAsset = currentContent?.resources?.icon;
    const color = theme.menu.sideMenu.item.backgroundColor; //currentContent.color;
    const isLight = Color.rgb(color).isLight();
    const actualColor = node === selected ?
        isLight ?
            Color.rgb(color).lightness(85).toString() :
            Color.rgb(color).darken(0.75).toString() :
        color;

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
                // overflow: "hidden"
            }}>
                <TouchableOpacity style={{
                    flex: 1, justifyContent: "center", alignItems: "center",
                    margin: 8 * size, marginBottom: 4, marginTop: depth === 0 ? 5 : 0, borderRadius: 14,
                    // backgroundColor: actualColor,
                    borderWidth: 2,
                    borderColor: node === selected ? currentContent.color : "transparent",
                }} onPress={pressHandler}>
                    <View style={{ padding: 12, width: "100%", justifyContent: "center", alignItems: "center", }}>
                        <FastImage style={{ width: 56 - offset, height: 56 - offset, marginBottom: 5, borderRadius: 16, overflow: "hidden" }} source={{
                            uri: `file://${currentAsset?.mipmap?.x128}`,
                        }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                        <Text style={{
                            fontFamily: config.fontFamily,
                            letterSpacing: 0.3,
                            fontSize: theme.menu.sideMenu.item.nameFontSize,
                            color: theme.menu.sideMenu.item.nameColor,
                            textAlign: "center",
                            fontWeight: "600",
                        }}>
                            {
                                currentContent.name
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                /*
                 Отображение подкатегорий
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
                                    <SideMenuItem key={child.id} depth={depth + 1}
                                        height={subItemHeight * (getChainChildren(child, selected).length + 1)}
                                        node={child} selected={selected} language={language} onPress={onPress}></SideMenuItem>
                                )
                            }
                        </View>
                    </Animated.View>
                    :
                    undefined
                */
            }
        </View>
    );
})