import React from "react";
import { TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ICtrlMenuButtonProps {
    onPress: () => void;
    text: string;
    disabled?: boolean;
    gradient?: Array<string | number>;
}

export const CtrlMenuButton = React.memo(({ onPress, text, disabled = false, gradient = ["rgb(49, 211, 48)", "rgb(126, 216, 59)"] }: ICtrlMenuButtonProps) => {
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
            <LinearGradient
                colors={disabled ? ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"] : gradient}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", width: "100%", height: 96, borderRadius: 16, padding: 12, zIndex: 1 }}
            >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                    {
                        text
                    }
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
})