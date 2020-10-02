import React, { useCallback } from "react";
import { View, Text } from "react-native";
import FastImage from "react-native-fast-image";
import { ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";

interface IMyOrderListItemItemProps {
    imageHeight: number;
    product: ICompiledProduct;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const MyOrderListItem = React.memo(({ imageHeight, currency, language, product }: IMyOrderListItemItemProps) => {
    const currentContent = product.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const changeQuantityHandler = useCallback((value: number) => {
        // etc...
    }, []);

    return (
        <View style={{ flex: 1, paddingLeft: 24, paddingRight: 24, marginBottom: 20 }}>
            <View style={{ flex: 1, width: "100%", height: imageHeight, marginBottom: 2, justifyContent: "flex-end" }}>
                <FastImage style={{ width: "100%", height: "100%" }} source={{
                    uri: `file://${currentAdAsset?.mipmap.x128}`,
                }} resizeMode={FastImage.resizeMode.contain}></FastImage>
            </View>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{ textAlign: "center", fontSize: 14, color: "rgba(0, 0, 0, 0.75)", fontWeight: "bold" }}>
                {
                    currentContent.name
                }
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 1 }}>
                <Text style={{ textAlign: "center", fontSize: 12, paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6, color: "rgba(0, 0, 0, 0.5)" }}>
                    {
                        `${(product.prices[currency.id as string]?.value * 0.01).toFixed(2)} ${currency.symbol}`
                    }
                </Text>
            </View>
            <NumericStapper
                buttonStyle={{ borderStyle: "solid", borderWidth: 0.5, borderRadius: 3, borderColor: "rgba(0, 0, 0, 0.5)", padding: 6 }}
                textStyle={{ width: 44 }}
                iconDecrement="-"
                iconIncrement="+"
                onChange={changeQuantityHandler}
            />
        </View>
    );
})