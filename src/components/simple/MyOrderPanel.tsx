import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icons } from "../../theme";
import { LanguagePicker } from "./LanguagePicker";
import { ICompiledLanguage } from "@djonnyx/tornado-types";

interface IMyOrderPanelProps {
    defaultLanguageCode: string;
    languages: Array<ICompiledLanguage>;
    onChangeLanguage: (lang: ICompiledLanguage) => void;
}

export const MyOrderPanel = ({ defaultLanguageCode, languages, onChangeLanguage }: IMyOrderPanelProps) => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.05)", padding: 16 }}
        >
            <View style={{ margin: "auto" }}>
                <LanguagePicker defaultLanguageCode={defaultLanguageCode} languages={languages} onSelect={onChangeLanguage}></LanguagePicker>
            </View>
        </View>
    )
}