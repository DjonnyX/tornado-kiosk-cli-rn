import React, { useState } from "react";
import { View, Text, Animated, EasingFunction, Easing } from "react-native";
import { SideMenu } from "./side-menu";
import { NavMenu } from "./nav-menu";
import { ICompiledMenuNode, ICompiledMenu, NodeTypes, ICompiledLanguage, ICurrency, ICompiledProduct } from "@djonnyx/tornado-types";
import LinearGradient from "react-native-linear-gradient";
import { MenuButton } from "./MenuButton";

interface IMenuProps {
    menu: ICompiledMenu;
    currency: ICurrency;
    language: ICompiledLanguage;
    width: number;
    positions: Array<ICompiledProduct>;

    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
}

export const Menu = ({
    menu, language, currency, width, positions,
    addPosition, updatePosition, removePosition,
}: IMenuProps) => {
    const [selectedCategoty, _setSelectedCategory] = useState(menu);
    const [menuPosition, _setMenuPosition] = useState(new Animated.Value(1));
    let menuAnimation: Animated.CompositeAnimation;

    const setSelectedCategory = (category: ICompiledMenuNode) => {
        _setSelectedCategory(prevCategory => category);

        if (category === menu) {
            sideMenuFadeOut();
        } else {
            sideMenuFadeIn();
        }
    };

    const selectSideMenuCategoryHandler = (node: ICompiledMenuNode) => {
        setSelectedCategory(node);
    }

    const selectNavMenuCategoryHandler = (node: ICompiledMenuNode) => {
        if (node.type === NodeTypes.SELECTOR || node.type === NodeTypes.SELECTOR_NODE) {
            setSelectedCategory(node);
        } else if (node.type === NodeTypes.PRODUCT) {
            // etc
        }
    }

    const onBack = () => {
        setSelectedCategory(menu);
    }

    const sideMenuFadeOut = () => {
        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 1,
            duration: 500,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    };

    const sideMenuFadeIn = () => {
        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 500,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    };

    const sideMenuWidth = 152;

    return (
        <View style={{ flex: 1, width, height: "100%" }}>
            <LinearGradient
                colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"]}
                style={{ display: "flex", position: "absolute", width: "100%", height: 96, zIndex: 1 }}
            >
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", height: "100%", padding: 16 }}>
                    {
                        selectedCategoty !== menu
                            ?
                            <View style={{ width: 132, justifyContent: "center", alignItems: "center" }}>
                                <MenuButton onPress={onBack}></MenuButton>
                            </View>
                            :
                            undefined
                    }
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ fontFamily: "RobotoSlab-Black", color: "rgba(0, 0, 0, 0.75)", fontSize: 32 }}>
                        {
                            selectedCategoty?.content?.contents[language.code]?.name || "Меню"
                        }
                    </Text>
                </View>
            </LinearGradient>
            <View style={{ flex: 1, flexDirection: "row", width: "100%", height: "100%" }}>
                <Animated.View style={{
                    position: "absolute",
                    width: 152,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 48,
                    left: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -sideMenuWidth],
                    }),
                }}>
                    <SideMenu menu={menu} language={language} selected={selectedCategoty} onPress={selectSideMenuCategoryHandler}></SideMenu>
                </Animated.View>
                <Animated.View style={{
                    position: "absolute",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    left: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [sideMenuWidth, 0],
                    }),
                    width: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [width - sideMenuWidth, width],
                    }),
                }}>
                    <NavMenu node={selectedCategoty} language={language} currency={currency} onPress={selectNavMenuCategoryHandler}></NavMenu>
                </Animated.View>
            </View>
        </View >
    )
}
