import React, { useRef, useCallback } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { ICompiledProduct, ICompiledLanguage, ICurrency, IOrderPosition } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";
import { MyOrderListItem } from "./MyOrderListItem";

interface IMyOrderListProps {
    positions: Array<IOrderPosition>;
    currency: ICurrency;
    language: ICompiledLanguage;

    addPosition: (position: ICompiledProduct) => void;
    updatePosition: (position: ICompiledProduct) => void;
    removePosition: (position: ICompiledProduct) => void;
}

export const MyOrderList = React.memo(({ currency, language, positions, addPosition, updatePosition, removePosition }: IMyOrderListProps) => {
    const scrollView = useRef<ScrollView>(null);

    const contentSizeChangeHandler = useCallback(() => {
        scrollView.current?.scrollToEnd({ animated: true });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView ref={scrollView} onContentSizeChange={contentSizeChangeHandler} style={{ flex: 1 }} horizontal={false}
            >
                <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={positions} renderItem={({ item }) => {
                    return <MyOrderListItem key={item.id} position={item} currency={currency} language={language} imageHeight={48}></MyOrderListItem>
                }}
                    keyExtractor={(item, index) => index.toString()}>
                </FlatList>
            </ScrollView>
        </SafeAreaView>
    )
})