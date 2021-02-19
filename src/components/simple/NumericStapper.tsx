import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";

interface INumericStepperButtonProps {
    icon: string;
    onPress: () => void;
    disabled?: boolean;
    style: StyleProp<ViewStyle>;
    disabledStyle: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
    disabledTextStyle: StyleProp<TextStyle>;
}

const NumericStepperButton = React.memo(({ icon, style, textStyle, disabled, disabledStyle, disabledTextStyle, onPress }: INumericStepperButtonProps) => {

    const actualStyle = disabled ? disabledStyle : style;
    const actualTextStyle = disabled ? disabledTextStyle : textStyle;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", ...actualStyle as any }}>
                <Text style={{ ...actualTextStyle as any }}>
                    {
                        icon
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
    textStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle | TextStyle>;
    disabledButtonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonTextStyle: StyleProp<TextStyle>;
    disabledButtonTextStyle: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconDecrement?: string;
    iconIncrement?: string;
    min?: number;
    max?: number;
}

export const NumericStapper = React.memo(({ value = 0, iconDecrement = "-", iconIncrement = "+",
    buttonStyle, disabledButtonStyle, disabledButtonTextStyle, buttonTextStyle,
    containerStyle, textStyle, min, max, formatValueFunction, onChange }: INumericStapperProps) => {
    const [isDecDisabled, setIsDecDisabled] = useState(value === min);
    const [isIncDisabled, setIsIncDisabled] = useState(value === max);

    const setValue = (value: number) => {
        onChange(value);
    }

    useEffect(() => {
        setIsDecDisabled(value === min);
        setIsIncDisabled(value === max);
    }, [min, max, value]);

    const decrementHandler = useCallback(() => {
        if (min === undefined || value > min) {
            setValue(value - 1);
        }
    }, [value, min]);

    const incrementHandler = useCallback(() => {
        if (max === undefined || value < max) {
            setValue(value + 1);
        }
    }, [value, max]);

    return (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", ...containerStyle as any }}>
            <NumericStepperButton disabled={isDecDisabled} style={buttonStyle} disabledStyle={disabledButtonStyle}
                textStyle={buttonTextStyle} disabledTextStyle={disabledButtonTextStyle} icon={iconDecrement} onPress={decrementHandler} />
            <Text style={{ flex: 1, textAlign: "center", ...textStyle as any }}>
                {
                    !!formatValueFunction
                        ? formatValueFunction(value)
                        : value.toString()
                }
            </Text>
            <NumericStepperButton disabled={isIncDisabled} style={buttonStyle} disabledStyle={disabledButtonStyle}
                textStyle={buttonTextStyle} disabledTextStyle={disabledButtonTextStyle} icon={iconIncrement} onPress={incrementHandler} />
        </View>
    );
})