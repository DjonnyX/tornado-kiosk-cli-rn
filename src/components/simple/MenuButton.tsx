import { ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import React from "react";
import { Icons } from "../../theme";
import { localize } from "../../utils/localization";
import { SimpleButton } from "./SimpleButton";

interface IMenuButtonProps {
    language: ICompiledLanguage;
    theme: IKioskThemeData;
    onPress: () => void;
}

export const MenuButton = ({ theme, onPress, language }: IMenuButtonProps) => {
    return (
        <>
            {
                !!theme &&
                <SimpleButton title={
                    localize(language, "kiosk_menu_back_button")
                }
                    styleView={{ opacity: 1 }}
                    style={{
                        backgroundColor: theme.menu.backButton.backgroundColor,
                        borderRadius: 8, padding: 20
                    }}
                    textStyle={{
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        color: theme.menu.backButton.textColor,
                        fontSize: theme.menu.backButton.textFontSize,
                    }}
                    onPress={onPress}>
                    <Icons name="ArrLeft" fill={theme.menu.backButton.iconColor} width={44} height={44} ></Icons>
                </SimpleButton>
            }
        </>
    )
}