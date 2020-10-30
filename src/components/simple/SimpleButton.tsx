import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text } from "react-native";

interface ISimpleButtonProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress: () => void;
}

export const SimpleButton = ({ title, style, textStyle, onPress }: ISimpleButtonProps) => {
    return (
        <TouchableOpacity style={{ borderRadius: 3, overflow: "hidden" }} onPress={onPress}>
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