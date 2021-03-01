import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text } from "react-native";

interface ISimpleButtonProps {
    title: string;
    disabled?: boolean;
    styleView?: StyleProp<ViewStyle>;
    styleViewDisabled?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    styleDisabled?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    textStyleDisabled?: StyleProp<TextStyle>;
    onPress: () => void;
}

export const SimpleButton = ({ title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled, disabled = false, onPress }: ISimpleButtonProps) => {
    let sView: StyleProp<ViewStyle> = { borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleView as any};

    let sLayout: StyleProp<ViewStyle> = { paddingLeft: 22, paddingRight: 22, paddingTop: 16, paddingBottom: 16, ...style as any };

    let sText: StyleProp<TextStyle> = { fontWeight: "bold", ...textStyle as any };

    if (disabled) {
        if (!!styleViewDisabled) {
            sView = { ...sView as any, ...styleViewDisabled as any };
        }
        if (!!styleDisabled) {
            sLayout = { ...sLayout as any, ...styleDisabled as any };
        }
        if (!!textStyleDisabled) {
            sText = { ...sText as any, ...textStyleDisabled as any };
        }
    }
    return (
        <TouchableOpacity style={sView} onPress={onPress} disabled={disabled}>
            <View
                style={sLayout}
            >
                <Text style={sText}>
                    {
                        title
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
}