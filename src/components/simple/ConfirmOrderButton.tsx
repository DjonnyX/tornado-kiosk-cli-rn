import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Icons } from "../../theme";
import LinearGradient from "react-native-linear-gradient";

interface IConfirmOrderButtonProps {
    onPress: () => void;
}

export const ConfirmOrderButton = ({ onPress }: IConfirmOrderButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={["rgb(49, 211, 48)", "rgb(126, 216, 59)"]}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", width: "100%", height: 96, borderRadius: 16, padding: 12, zIndex: 1 }}
            >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                    Заказать
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}