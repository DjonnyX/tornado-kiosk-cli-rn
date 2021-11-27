import React, { useCallback } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { config } from "../../Config";

interface ICtrlMenuButtonProps {
    onPress: () => void;
    text: string;
    disabled?: boolean;
    gradient: Array<string | number>;
    gradientDisabled: Array<string | number>;
}

export const CtrlMenuButton = React.memo(({ onPress, text, disabled = false, gradient, gradientDisabled }: ICtrlMenuButtonProps) => {
    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled]);

    return (
        <TouchableOpacity style={{ flex: 1, height: "100%" }} onPress={onPressHandler}>
            <View style={{
                backgroundColor: disabled ? gradientDisabled[0] : gradient[0] as any,
                display: "flex", alignItems: "center", justifyContent: "center", position: "absolute",
                width: "100%", height: "100%", borderRadius: 16, padding: 12, zIndex: 1
            }}
            >
                <Text style={{
                    fontFamily: config.fontFamilyRegular,
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600"
                }}>
                    {
                        text
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
})