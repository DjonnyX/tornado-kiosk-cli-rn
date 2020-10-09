import React, { useState, useCallback } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { SideMenu } from "./side-menu";
import { NavMenu } from "./nav-menu";
import { ICompiledMenuNode, ICompiledMenu, NodeTypes, ICompiledLanguage, ICurrency, ICompiledProduct, IOrderPosition } from "@djonnyx/tornado-types";
import LinearGradient from "react-native-linear-gradient";
import { MenuButton } from "./MenuButton";
import { CtrlMenuButton } from "./CtrlMenuButton";
import { theme } from "../../theme";

interface IMenuProps {
    menu: ICompiledMenu;
    currency: ICurrency;
    language: ICompiledLanguage;
    width: number;
    height: number;
    positions: Array<IOrderPosition>;

    cancelOrder: () => void;
    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
}

const sideMenuWidth = 180;

export const Menu = React.memo(({
    menu, language, currency, width, height, positions, cancelOrder,
    addPosition, updatePosition, removePosition,
}: IMenuProps) => {
    const [selected, _setSelectedCategory] = useState({ current: menu, previouse: menu });
    const [menuPosition, _setMenuPosition] = useState(new Animated.Value(1));
    const [screenPosition, _setScreenPosition] = useState(new Animated.Value(0));
    let menuAnimation: Animated.CompositeAnimation;
    let screenAnimation: Animated.CompositeAnimation;

    const setSelectedCategory = (category: ICompiledMenuNode) => {
        if (category === selected.current) {
            return;
        }

        _setSelectedCategory(previouse => {

            setTimeout(() => {
                if (category.index > previouse.current.index) {
                    screenFadeOut();
                } else {
                    screenFadeIn();
                }

                if (category === menu) {
                    sideMenuFadeOut();
                } else {
                    sideMenuFadeIn();
                }
            });

            return { current: category, previouse: previouse.current };
        });
    };

    const selectSideMenuCategoryHandler = useCallback((node: ICompiledMenuNode) => {
        if (node === selected.current) {
            return;
        }

        navigateTo(node);
    }, []);

    const selectNavMenuCategoryHandler = useCallback((node: ICompiledMenuNode) => {
        if (node === selected.current) {
            return;
        }

        navigateTo(node);
    }, []);

    // навигация / добавление продукта
    const navigateTo = (node: ICompiledMenuNode) => {
        setTimeout(() => {
            if (node.type === NodeTypes.SELECTOR || node.type === NodeTypes.SELECTOR_NODE) {

                // навигация по категории
                setSelectedCategory(node);
            } else if (node.type === NodeTypes.PRODUCT) {

                // добавление позиции
                addPosition(node.content as ICompiledProduct);
            }
        });
    }

    // возврат к предидущей категории
    const onBack = useCallback(() => {
        setTimeout(() => {
            setSelectedCategory(selected.current.parent || menu);
        });
    }, []);

    // анимация скрытия бокового меню
    const sideMenuFadeOut = useCallback(() => {
        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    }, []);

    // анимация отображения бокового меню
    const sideMenuFadeIn = useCallback(() => {
        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    }, []);

    // анимация скрытия бокового меню
    const screenFadeOut = useCallback(() => {
        if (screenAnimation) {
            screenAnimation.stop();
        }
        screenPosition.setValue(1);
        screenAnimation = Animated.timing(screenPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        screenAnimation.start();
    }, []);

    // анимация отображения бокового меню
    const screenFadeIn = useCallback(() => {
        if (screenAnimation) {
            screenAnimation.stop();
        }
        screenPosition.setValue(0);
        screenAnimation = Animated.timing(screenPosition, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        screenAnimation.start();
    }, []);

    return (
        <View style={{ flex: 1, width, height: "100%" }}>
            <LinearGradient
                colors={theme.themes[theme.name].menu.header.background}
                style={{ display: "flex", position: "absolute", width: "100%", height: 96, zIndex: 1 }}
            >
                <View style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", height: "100%", padding: 16 }}>
                    <Animated.View style={{
                        width: 162,
                        justifyContent: "center",
                        alignItems: "center",
                        top: 10,
                        left: menuPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, -sideMenuWidth],
                        }),
                    }}>
                        <MenuButton onPress={onBack}></MenuButton>
                    </Animated.View>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: theme.themes[theme.name].menu.header.titleColor, fontSize: 32, marginRight: 24 }}>
                        {
                            selected?.current.content?.contents[language.code]?.name || "Меню"
                        }
                    </Text>
                </View>
            </LinearGradient>
            <View style={{ position: "absolute", overflow: "hidden", flexDirection: "row", width: "100%", height: "100%" }}>
                <Animated.View style={{
                    position: "absolute",
                    width: sideMenuWidth,
                    height: "100%",
                    marginTop: 48,
                    left: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -sideMenuWidth],
                    }),
                }}>
                    <View style={{ flex: 1, flexGrow: 1, margin: "auto" }}>
                        <SideMenu menu={menu} language={language} selected={selected.current} onPress={selectSideMenuCategoryHandler}></SideMenu>
                    </View>
                    <View style={{ flex: 0, width: "100%", height: 192, margin: "auto", padding: 24 }}>
                        <CtrlMenuButton
                            gradient={theme.themes[theme.name].menu.ctrls.cancelButton.backgroundColor}
                            gradientDisabled={theme.themes[theme.name].menu.ctrls.cancelButton.disabledBackgroundColor}
                            text="Отменить" onPress={cancelOrder} />
                    </View>
                </Animated.View>
                <Animated.View style={{
                    position: "absolute",
                    height: "100%",
                    zIndex: 0,
                    left: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [sideMenuWidth, 0],
                    }),
                    width: menuPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [width - sideMenuWidth, width],
                        easing: Easing.linear,
                    }),
                }}>

                    <Animated.View style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        top: screenPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, height],
                        }),
                    }}>
                        <NavMenu node={selected.previouse.index <= selected.current.index ? selected.current : selected.previouse} language={language} currency={currency} onPress={selectNavMenuCategoryHandler}></NavMenu>
                    </Animated.View>

                    <Animated.View style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        top: screenPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-height, 0],
                        }),
                    }}>
                        <NavMenu node={selected.previouse.index > selected.current.index ? selected.current : selected.previouse} language={language} currency={currency} onPress={selectNavMenuCategoryHandler}></NavMenu>
                    </Animated.View>
                </Animated.View>
            </View>
        </View >
    )
})