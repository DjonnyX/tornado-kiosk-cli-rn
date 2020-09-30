import React from "react";
import { View, Text } from "react-native";
import { LanguagePicker } from "./LanguagePicker";
import { ICompiledLanguage, ICompiledOrderType, ICompiledProduct, ICurrency } from "@djonnyx/tornado-types";
import { OrderTypesPicker } from "./OrderTypesPicker";
import { MyOrderList } from "./my-order-list";
import { ConfirmOrderButton } from "./ConfirmOrderButton";

interface IMyOrderPanelProps {
    currency: ICurrency;
    language: ICompiledLanguage;
    languages: Array<ICompiledLanguage>;
    orderTypes: Array<ICompiledOrderType>;
    positions: Array<ICompiledProduct>;
    sum: number;

    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
    onChangeLanguage: (lang: ICompiledLanguage) => void;
    onChangeOrderType: (lang: ICompiledOrderType) => void;
}

export const MyOrderPanel = ({ currency, language, languages, orderTypes, positions, sum,
    addPosition, updatePosition, removePosition, onChangeLanguage, onChangeOrderType,
}: IMyOrderPanelProps) => {

    const confirmHandler = () => {
        // etc...
    };

    return (
        <View
            style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
            <View style={{ padding: 16, alignItems: "center" }}>
                <View style={{ margin: "auto", marginTop: 20, marginBottom: 32, alignItems: "center" }}>
                    <LanguagePicker language={language} languages={languages} onSelect={onChangeLanguage}></LanguagePicker>
                </View>
                <View style={{ margin: "auto", marginBottom: 20, alignItems: "center" }}>
                    <OrderTypesPicker language={language} orderTypes={orderTypes} onSelect={onChangeOrderType}></OrderTypesPicker>
                </View>
                <View style={{ margin: "auto", marginBottom: 20, alignItems: "center" }}>
                    <Text>
                        Сумма заказа
                    </Text>
                    <Text style={{fontWeight: "bold", fontSize: 18}}>
                        {
                            `${(sum * 0.01).toFixed(2)} ${currency.symbol}`
                        }
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1, flexGrow: 1, margin: "auto" }}>
                <MyOrderList currency={currency} language={language} positions={positions}
                    addPosition={addPosition} updatePosition={updatePosition} removePosition={removePosition}
                ></MyOrderList>
            </View>
            <View style={{ flex: 0, height: 172, margin: "auto", padding: 16 }}>
                <ConfirmOrderButton onPress={confirmHandler}></ConfirmOrderButton>
            </View>
        </View>
    )
}