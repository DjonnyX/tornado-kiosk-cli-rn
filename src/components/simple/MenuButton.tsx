import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icons } from "../../theme";

interface IMenuButtonProps {
    onPress: () => void;
}

export const MenuButton = ({ onPress }: IMenuButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ borderRadius: 16, padding: 12, borderWidth: 2, borderColor: "rgba(0, 0, 0, 0.15)" }}
            >
                <Icons name="Menu" fill="rgba(0, 0, 0, 0.3)"></Icons>
            </View>
        </TouchableOpacity>
    )
}