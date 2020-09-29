import React from "react";
import { View, TouchableHighlight } from "react-native";
import { Icons } from "../../theme";

interface IMenuButtonProps {
    onPress: () => void;
}

export const MenuButton = ({ onPress }: IMenuButtonProps) => {
    return (
        <TouchableHighlight onPress={onPress}>
            <View>
                <Icons name="Menu" fill="rgba(0, 0, 0, 0.5)"></Icons>
            </View>
        </TouchableHighlight>
    )
}