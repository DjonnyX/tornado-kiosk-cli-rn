import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Animated, Easing, LayoutChangeEvent } from "react-native";

interface IBound {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface INumericStepperButtonProps {
    icon: string;
    onPress: () => void;
    onLayoutChange?: (bound: IBound) => void;
    disabled?: boolean;
    selected?: boolean;
    style: StyleProp<ViewStyle>;
    selectedStyle?: StyleProp<ViewStyle>;
    disabledStyle: StyleProp<ViewStyle>;
    disabledSelectedStyle?: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
    textSelectedStyle?: StyleProp<TextStyle>;
    disabledTextStyle: StyleProp<TextStyle>;
    disabledSelectedTextStyle?: StyleProp<TextStyle>;
}

const NumericStepperButton = ({ icon, style, selectedStyle, textStyle, textSelectedStyle, disabled, selected,
    disabledStyle, disabledSelectedStyle, disabledTextStyle, disabledSelectedTextStyle, onPress, onLayoutChange }: INumericStepperButtonProps) => {

    const actualStyle = disabled ?
        selected && disabledSelectedStyle ?
            disabledSelectedStyle :
            disabledStyle :
        selected && selectedStyle ?
            selectedStyle :
            style;

    const actualTextStyle = disabled ?
        selected && disabledSelectedTextStyle ?
            disabledSelectedTextStyle :
            disabledTextStyle :
        selected && textSelectedStyle ?
            textSelectedStyle :
            textStyle;

    const _onLayoutChange = (e: LayoutChangeEvent) => {
        if (!onLayoutChange) {
            return;
        }

        const { x, y, width, height } = e.nativeEvent.layout;
        onLayoutChange({ x, y, width, height });
    }

    const _onPress = useCallback(() => {
        if (!disabled && !!onPress) {
            onPress();
        }
    }, [disabled]);

    return (
        <TouchableOpacity onPress={onPress} onLayout={_onLayoutChange}>
            <View style={{ alignItems: "center", justifyContent: "center", ...actualStyle as any }}>
                <Text style={{ ...actualTextStyle as any }}>
                    {
                        icon
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );
};

interface INumericStepperPlaceholderProps {
    text: string;
    disabled: boolean;
    onPress?: () => void;
    onLayoutChange?: (bound: IBound) => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const NumericStepperPlaceholder = React.memo(({ text, disabled, style, textStyle, onPress, onLayoutChange }: INumericStepperPlaceholderProps) => {
    const _onLayoutChange = (e: LayoutChangeEvent) => {
        if (!onLayoutChange) {
            return;
        }

        const { x, y, width, height } = e.nativeEvent.layout;
        onLayoutChange({ x, y, width, height });
    }

    const _onPress = useCallback(() => {
        if (!disabled && !!onPress) {
            onPress();
        }
    }, [disabled]);
    return (
        <TouchableOpacity onPress={onPress} onLayout={_onLayoutChange}>
            <View style={{ alignItems: "center", justifyContent: "center", ...style as any }}>
                <Text style={{ ...textStyle as any }}>
                    {
                        text
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );
});

interface INumericStapperProps {
    onChange: (value: number) => void;
    value?: number;
    formatValueFunction?: (value: number) => string;
    animationOnInit?: boolean;
    textStyle?: StyleProp<TextStyle>;
    textSelectedStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonSelectedStyle?: StyleProp<ViewStyle | TextStyle>;
    disabledButtonStyle?: StyleProp<ViewStyle | TextStyle>;
    disabledSelectedButtonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonTextStyle: StyleProp<TextStyle>;
    buttonSelectedTextStyle?: StyleProp<TextStyle>;
    disabledButtonTextStyle?: StyleProp<TextStyle>;
    disabledSelectedButtonTextStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconDecrement?: string;
    iconIncrement?: string;
    min?: number;
    max?: number;
}

export const NumericStapper = React.memo(({ value = 0, iconDecrement = "-", iconIncrement = "+", animationOnInit = false,
    buttonStyle, buttonSelectedStyle, disabledButtonStyle, disabledSelectedButtonStyle, disabledButtonTextStyle,
    disabledSelectedButtonTextStyle, buttonTextStyle, buttonSelectedTextStyle,
    containerStyle, textStyle, min, max, formatValueFunction, onChange }: INumericStapperProps) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isDecDisabled, setIsDecDisabled] = useState(value === min);
    const [isIncDisabled, setIsIncDisabled] = useState(value === max);
    const [controlsPos, setControlsPos] = useState(new Animated.Value(animationOnInit ? 0 : Number(Boolean(value > 0))));
    let expandAnimation: Animated.CompositeAnimation;
    const [bound, _setBound] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [boundDecButton, _setBoundDecButton] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [boundIncButton, _setBoundIncButton] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const _onLayoutChange = useCallback((e: LayoutChangeEvent) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        _setBound({ x, y, width, height });
    }, []);

    useEffect(() => {
        if (value > 0) {
            animationIn();
        } else {
            animationOut();
        }
    }, [value]);

    useEffect(() => {
        setIsDecDisabled(value === min);
        setIsIncDisabled(value === max);
    }, [min, max, value]);

    const decrementHandler = useCallback(() => {
        if (min === undefined || value > min) {
            const v = value - 1;
            onChange(v);
        }
    }, [value, min]);

    const incrementHandler = useCallback(() => {
        if (max === undefined || value < max) {
            const v = value + 1;
            onChange(v);
        }
    }, [value, max]);

    const placeholderTapHandler = useCallback(() => {
        incrementHandler();
    }, [value, max]);

    const animationIn = useCallback(() => {
        if (expandAnimation) {
            expandAnimation.stop();
        }
        expandAnimation = Animated.timing(controlsPos, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        expandAnimation.start();
    }, []);

    const animationOut = useCallback(() => {
        if (expandAnimation) {
            expandAnimation.stop();
        }
        expandAnimation = Animated.timing(controlsPos, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        expandAnimation.start();
    }, []);

    const decButtonLayoutChangeHandler = useCallback((bound: IBound) => {
        _setBoundDecButton(bound);
    }, []);

    const incButtonLayoutChangeHandler = useCallback((bound: IBound) => {
        _setBoundIncButton(bound);
    }, []);

    return (
        <View onLayout={_onLayoutChange} style={{
            flex: 1, overflow: "hidden",
            flexDirection: "row", alignItems: "center", justifyContent: "center", height: Math.max(boundIncButton.height, boundDecButton.height),
            ...containerStyle as any,
        }}>
            <Animated.View style={{
                position: "absolute",
                left: controlsPos.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-boundDecButton.width - 2, 0],
                }),
            }}>
                <NumericStepperButton disabled={isDecDisabled} selected={value > 0} style={buttonStyle} selectedStyle={buttonSelectedStyle}
                    disabledStyle={disabledButtonStyle} disabledSelectedStyle={disabledSelectedButtonStyle}
                    textStyle={buttonTextStyle} textSelectedStyle={buttonSelectedTextStyle}
                    disabledTextStyle={disabledButtonTextStyle} disabledSelectedTextStyle={disabledSelectedButtonTextStyle}
                    icon={iconDecrement} onPress={decrementHandler} onLayoutChange={decButtonLayoutChangeHandler} />
            </Animated.View>

            {
                bound.width > 0 &&
                <Animated.View style={{
                    position: "absolute",
                    left: controlsPos.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, boundDecButton.width],
                    }),
                    width: controlsPos.interpolate({
                        inputRange: [0, 1],
                        outputRange: [bound.width, bound.width - boundDecButton.width - boundIncButton.width]
                    })
                }}>
                    <NumericStepperPlaceholder disabled={isIncDisabled} onPress={placeholderTapHandler} text={
                        !!formatValueFunction
                            ? formatValueFunction(value)
                            : value.toString()
                    } textStyle={{ flex: 1, textAlign: "center", ...textStyle as any, opacity: value === 0 ? 0.5 : 1 }} />
                </Animated.View>
            }

            <Animated.View style={{
                position: "absolute",
                right: controlsPos.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-boundIncButton.width - 2, 0],
                }),
            }}>
                <NumericStepperButton disabled={isIncDisabled} selected={value > 0} style={buttonStyle} selectedStyle={buttonSelectedStyle}
                    disabledStyle={disabledButtonStyle} disabledSelectedStyle={disabledSelectedButtonStyle}
                    textStyle={buttonTextStyle} textSelectedStyle={buttonSelectedTextStyle}
                    disabledTextStyle={disabledButtonTextStyle} disabledSelectedTextStyle={disabledSelectedButtonTextStyle}
                    icon={iconIncrement} onPress={incrementHandler} onLayoutChange={incButtonLayoutChangeHandler} />
            </Animated.View>
        </View>
    );
})