import React from "react";
import { View } from "react-native";
import { LanguagePicker } from "./LanguagePicker";
import { ICompiledLanguage, ICompiledOrderType, ICompiledProduct } from "@djonnyx/tornado-types";
import { OrderTypesPicker } from "./OrderTypesPicker";

interface IMyOrderPanelProps {
    language: ICompiledLanguage;
    languages: Array<ICompiledLanguage>;
    orderTypes: Array<ICompiledOrderType>;
    positions: Array<ICompiledProduct>;

    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
    onChangeLanguage: (lang: ICompiledLanguage) => void;
    onChangeOrderType: (lang: ICompiledOrderType) => void;
}

export const MyOrderPanel = ({ language, languages, orderTypes, positions,
    addPosition, updatePosition, removePosition, onChangeLanguage, onChangeOrderType,
}: IMyOrderPanelProps) => {
    return (
        <View
            style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.05)", padding: 16 }}
        >
            <View style={{ margin: "auto", marginTop: 20, marginBottom: 32 }}>
                <LanguagePicker language={language} languages={languages} onSelect={onChangeLanguage}></LanguagePicker>
            </View>
            <View style={{ margin: "auto", marginBottom: 20 }}>
                <OrderTypesPicker language={language} orderTypes={orderTypes} onSelect={onChangeOrderType}></OrderTypesPicker>
            </View>
        </View>
    )
}