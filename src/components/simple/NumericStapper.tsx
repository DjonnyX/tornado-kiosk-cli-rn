import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

interface INumericStepperButtonProps {
    icon: string;
    onPress: () => void;
    style: StyleProp<ViewStyle>;
}

const NumericStepperButton = ({ icon, style, onPress }: INumericStepperButtonProps) => {
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", ...style as any }}>
                <Text>
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
    startWith?: number;
    buttonStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconDecrement?: string;
    iconIncrement?: string;
}

export const NumericStapper = ({ startWith = 0, iconDecrement = "-", iconIncrement = "+", buttonStyle, containerStyle, onChange }: INumericStapperProps) => {
    const [value, _setValue] = useState((startWith));

    const setValue = (value: number) => {
        _setValue(prevValue => value);
    }

    const decrementHandler = () => {
        setValue(value - 1);
        onChange(value);
    };

    const incrementHandler = () => {
        setValue(value + 1);
        onChange(value);
    };

    return (
        <View style={{ flex: 1, flexDirection: "row", ...containerStyle as any }}>
            <NumericStepperButton style={buttonStyle} icon={iconDecrement} onPress={decrementHandler} />
            <Text>
                {
                    value.toString()
                }
            </Text>
            <NumericStepperButton style={buttonStyle} icon={iconIncrement} onPress={incrementHandler} />
        </View>
    );
}


