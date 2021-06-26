import React from "react";
import { View, Text } from "react-native";
import { IAlertButton } from "../../interfaces";
import { theme } from "../../theme";
import { SimpleButton } from "./SimpleButton";

interface IAlertContentProps {
    title: string;
    message: string;
    buttons: Array<IAlertButton>;
}

export const AlertContent = React.memo(({ title, message, buttons }: IAlertContentProps) => {
    return (
        <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "column", marginBottom: 32 }}>
                <Text style={{
                    fontWeight: "bold", textTransform: "uppercase",
                    color: theme.themes[theme.name].common.alert.titleColor,
                    fontSize: theme.themes[theme.name].common.alert.titleFontSize
                }}>
                    {title}
                </Text>
                <Text style={{
                    fontWeight: "bold",
                    color: theme.themes[theme.name].common.alert.messageColor,
                    fontSize: theme.themes[theme.name].common.alert.messageFontSize
                }}>
                    {message}
                </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                {
                    buttons.map((b, i) =>
                        <SimpleButton key={i} style={{
                            borderRadius: 6,
                            backgroundColor: theme.themes[theme.name].common.alert.buttonColor, marginLeft: i > 0 ? 12 : 0
                        }}
                            textStyle={{
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                color: theme.themes[theme.name].common.alert.buttonTextColor,
                                fontSize: theme.themes[theme.name].common.alert.buttonTextFontSize,
                            }} onPress={() => {
                                if (!!b.action) {
                                    b.action();
                                }
                            }} title={b.title} />
                    )
                }
            </View>
        </View>
    );
})