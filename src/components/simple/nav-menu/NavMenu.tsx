import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderType, IKioskThemeData, ICompiledTag } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { GridList } from "../../layouts/GridList";
import { MenuNode } from "../../../core/menu/MenuNode";
import { IOrderWizard } from "../../../core/interfaces";

interface INavMenuProps {
    isOpened: boolean;
    theme: IKioskThemeData;
    menuStateId: number;
    orderStateId: number;
    orderWizard: IOrderWizard;
    orderType: ICompiledOrderType;
    node: MenuNode;
    currency: ICurrency;
    language: ICompiledLanguage;
    selectedTags: Array<ICompiledTag>;
    onPress: (node: MenuNode) => void;
}

export const NavMenu = React.memo(({ theme, isOpened, currency, language, node, selectedTags, orderWizard, orderStateId, orderType, menuStateId, onPress }: INavMenuProps) => {
    const [screenPosition, setScreenPosition] = useState(new Animated.Value(0));
    let screenAnimation: Animated.CompositeAnimation;

    useEffect(() => {
        if (isOpened) {
            screenFadeIn();
        } else {
            screenFadeOut();
        }
    }, [isOpened]);

    // анимация скрытия бокового меню
    const screenFadeOut = useCallback(() => {
        if (screenAnimation) {
            screenAnimation.stop();
        }
        screenPosition.setValue(1);
        screenAnimation = Animated.timing(screenPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 100,
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
            duration: 100,
            easing: Easing.cubic,
            delay: 10,
        });
        screenAnimation.start();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <Animated.View style={{
                flex: 1,
                height: "100%", width: "100%", paddingTop: 20,
                marginTop: screenPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 100],
                }),
            }}>
                <ScrollView style={{ flex: 1, paddingTop: 10 }} horizontal={false}
                >
                    <GridList style={{ flex: 1 }} disbleStartAnimation padding={10} spacing={12} data={
                        !selectedTags?.length ? node.activeChildren : node.activeChildren?.filter(item => selectedTags.find(tag => item.tags?.indexOf(tag) > -1))} itemDimension={196}
                        animationSkipFrames={10} renderItem={({ item }) => {
                            return <NavMenuItem key={item.id} theme={theme} orderWizard={orderWizard} orderStateId={orderStateId}
                                stateId={item.stateId} node={item} currency={currency} language={language}
                                thumbnailHeight={128} onPress={onPress}></NavMenuItem>
                        }}
                        keyExtractor={(item, index) => item.id}>
                    </GridList>
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
});