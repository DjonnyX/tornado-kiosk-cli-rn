import React from "react";
import { SafeAreaView } from "react-native";
import { ICompiledMenu, ICompiledMenuNode, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

interface INavMenuProps {
    node: ICompiledMenu;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: ICompiledMenuNode) => void;
}

export const NavMenu = ({ currency, language, node, onPress }: INavMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView style={{ flex: 1 }} horizontal={false}
            >
                <FlatGrid style={{ flex: 1, paddingTop: 78 }} spacing={6} data={node.children} itemDimension={196} renderItem={({ item }) => {
                    return <NavMenuItem key={item.id} node={item} currency={currency} language={language} imageHeight={144} onPress={onPress}></NavMenuItem>
                }}
                    keyExtractor={(item, index) => item.id}>
                </FlatGrid>
            </ScrollView>
        </SafeAreaView>
    );
}