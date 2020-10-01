import React, { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { ICompiledProduct, ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";
import { MyOrderListItem } from "./MyOrderListItem";

interface IMyOrderListProps {
    positions: Array<ICompiledProduct>;
    currency: ICurrency;
    language: ICompiledLanguage;

    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
}

export const MyOrderList = ({ currency, language, positions, addPosition, updatePosition, removePosition }: IMyOrderListProps) => {
    const [scrollView, _setScrollView] = useState<ScrollView>(undefined as any);

    const setRef = (ref: ScrollView) => {
        _setScrollView(() => ref);
    };

    const onContentSizeChange = () => {
        scrollView?.scrollToEnd({ animated: true });
    }

    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView ref={setRef} onContentSizeChange={onContentSizeChange} style={{ flex: 1 }} horizontal={false}
            >
                <FlatList style={{ flex: 1 }} data={positions} renderItem={({ item }) => {
                    return <MyOrderListItem key={item.id} product={item} currency={currency} language={language} imageHeight={48}></MyOrderListItem>
                }}
                    keyExtractor={(item, index) => item.id}>
                </FlatList>
            </ScrollView>
        </SafeAreaView>
    )
}