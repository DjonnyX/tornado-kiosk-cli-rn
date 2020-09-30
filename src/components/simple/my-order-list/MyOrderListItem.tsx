import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";

interface IMyOrderListItemItemProps {
    imageHeight: number;
    product: ICompiledProduct;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const MyOrderListItem = ({ imageHeight, currency, language, product }: IMyOrderListItemItemProps) => {
    const currentContent = product.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const changeQuantityHandler = (value: number) => {

    };

    return (
        <View style={{ flex: 1, /*backgroundColor: currentContent.color,*/ borderRadius: 16, padding: 4 }}>
            <View style={{ flex: 1, width: "100%", height: imageHeight, marginBottom: 2, justifyContent: "flex-end" }}>
                <Image style={{ width: "100%", height: "100%" }} source={{
                    uri: `file://${currentAdAsset?.mipmap.x128}`,
                }} resizeMode="contain" resizeMethod="scale"></Image>
            </View>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{ fontSize: 14, marginBottom: 4, color: "rgba(0, 0, 0, 0.75)", fontWeight: "bold" }}>
                {
                    currentContent.name
                }
            </Text>
            <View style={{ borderStyle: "solid", borderWidth: 0.5, borderRadius: 3, alignItems: "center", justifyContent: "center", borderColor: "rgba(0, 0, 0, 0.5)", marginBottom: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6, color: "rgba(0, 0, 0, 0.75)" }}>
                    {
                        `${(product.prices[currency.id as string]?.value * 0.01).toFixed(2)} ${currency.symbol}`
                    }
                </Text>
            </View>
            <NumericStapper
                buttonStyle={{ borderStyle: "solid", borderWidth: 0.5, borderRadius: 3, borderColor: "rgba(0, 0, 0, 0.5)", padding: 10 }}
                iconDecrement="-"
                iconIncrement="+"
                onChange={changeQuantityHandler}
            />
        </View>
    );
}