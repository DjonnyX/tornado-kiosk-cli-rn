import { ICompiledLanguage } from "@djonnyx/tornado-types";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icons, theme } from "../../theme";
import { localize } from "../../utils/localization";
import { SimpleButton } from "./SimpleButton";

interface IMenuButtonProps {
    language: ICompiledLanguage;
    themeName: string;
    onPress: () => void;
}

export const MenuButton = ({ themeName, onPress, language }: IMenuButtonProps) => {
    return (
        <SimpleButton title={
            localize(language, "kiosk_menu_back_button")
        }
            styleView={{ opacity: 1 }}
            style={{
                backgroundColor: theme.themes[theme.name].menu.backButton.backgroundColor,
                borderRadius: 8, padding: 20
            }}
            textStyle={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: theme.themes[theme.name].menu.backButton.textColor,
                fontSize: theme.themes[theme.name].menu.backButton.textFontSize,
            }}
            onPress={onPress}>
            <Icons name="ArrLeft" fill={theme.themes[theme.name].menu.backButton.iconColor} width={44} height={44} ></Icons>
        </SimpleButton>
    )
}