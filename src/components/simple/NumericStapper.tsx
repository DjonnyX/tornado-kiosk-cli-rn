import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";

interface INumericStepperButtonProps {
    icon: string;
    onPress: () => void;
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
}

const NumericStepperButton = ({ icon, style, textStyle, onPress }: INumericStepperButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", ...style as any }}>
                <Text style={{...textStyle as any}}>
                    {
                        icon
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );
}

interface INumericStapperProps {
    onChange: (value: number) => void;
    value?: number;
    formatValueFunction?: (value: number) => string;
    textStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonTextStyle: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconDecrement?: string;
    iconIncrement?: string;
}

export const NumericStapper = React.memo(({ value = 0, iconDecrement = "-", iconIncrement = "+", buttonStyle, buttonTextStyle,
containerStyle, textStyle, formatValueFunction, onChange }: INumericStapperProps) => {

    const setValue = (value: number) => {
        onChange(value);
    }

    const decrementHandler = useCallback(() => {
        setValue(value - 1);
    }, [value]);

    const incrementHandler = useCallback(() => {
        setValue(value + 1);
    }, [value]);

    return (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", ...containerStyle as any }}>
            <NumericStepperButton style={buttonStyle} textStyle={buttonTextStyle} icon={iconDecrement} onPress={decrementHandler} />
            <Text style={{ flex: 1, textAlign: "center", ...textStyle as any }}>
                {
                    !!formatValueFunction
                    ? formatValueFunction(value)
                    : value.toString()
                }
            </Text>
            <NumericStepperButton style={buttonStyle} textStyle={buttonTextStyle} icon={iconIncrement} onPress={incrementHandler} />
        </View>
    );
})