import React from "react";
import { View, Text } from "react-native";
import { IAlertButton } from "../../interfaces";
import { SimpleButton } from "./SimpleButton";

interface IAlertContentProps {
    title: string;
    message: string;
    buttons: Array<IAlertButton>;
}

export const AlertContent = React.memo(({ title, message, buttons }: IAlertContentProps) => {
    return (
        <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "column", marginBottom: 20 }}>
                <Text style={{ fontSize: 20, textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>{title}</Text>
                <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>{message}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                {
                    buttons.map((b, i) =>
                        <SimpleButton key={i} style={{ backgroundColor: "yellow", marginLeft: i > 0 ? 10 : 0 }}
                            textStyle={{ color: "rgba(0,0,0,0.75)" }} onPress={b.action} title={b.title} />
                    )
                }
            </View>
        </View>
    );
})