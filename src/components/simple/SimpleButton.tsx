import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text } from "react-native";

interface ISimpleButtonProps {
    title: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress: () => void;
}

export const SimpleButton = ({ title, style, textStyle, disabled = false, onPress }: ISimpleButtonProps) => {
    return (
        <TouchableOpacity style={{ borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1 }} onPress={onPress} disabled={disabled}>
            <View
                style={{ paddingLeft: 18, paddingRight: 18, paddingTop: 10, paddingBottom: 10, ...style as any }}
            >
                <Text style={{ fontWeight: "bold", ...textStyle as any }}>
                    {
                        title
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
}