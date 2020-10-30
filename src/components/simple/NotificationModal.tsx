import React, { useCallback, useState } from "react";
import { View, Modal, Animated, Easing, Dimensions } from "react-native";
import { theme } from "../../theme";

interface INotificationModalProps {
    children: JSX.Element;
    visible: boolean;
}

export const NotificationModal = React.memo(({ children, visible }: INotificationModalProps) => {
    const [position, _setPosition] = useState(new Animated.Value(0));
    let positionAnimation: Animated.CompositeAnimation;

    // анимация скрытия
    const sideMenuFadeOut = useCallback(() => {
        if (positionAnimation) {
            positionAnimation.stop();
        }
        positionAnimation = Animated.timing(position, {
            useNativeDriver: false,
            toValue: 0,
            duration: 500,
            easing: Easing.cubic,
            delay: 10,
        });
        positionAnimation.start();
    }, []);

    // анимация отображения
    const sideMenuFadeIn = useCallback(() => {
        if (positionAnimation) {
            positionAnimation.stop();
        }
        positionAnimation = Animated.timing(position, {
            useNativeDriver: false,
            toValue: 1,
            duration: 500,
            easing: Easing.cubic,
            delay: 10,
        });
        positionAnimation.start();
    }, []);

    if (visible) {
        sideMenuFadeIn();
    } else {
        sideMenuFadeOut();
    }

    return (
        <Animated.View pointerEvents="none" style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            bottom: position.interpolate({
                inputRange: [0, 1],
                outputRange: [-Dimensions.get("window").height, 32],
            }),
            zIndex: 5,
        }}>
            <View style={{
                margin: 20,
                borderWidth: 1,
                borderColor: theme.themes[theme.name].common.modalNotification.window.borderColor,
                backgroundColor: theme.themes[theme.name].common.modalNotification.window.background,
                borderRadius: 8,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 8,
            }}>
                {
                    children
                }
            </View>
        </Animated.View>
    );
})