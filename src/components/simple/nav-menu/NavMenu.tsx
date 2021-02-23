import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { GridList } from "../../layouts/GridList";
import { MenuNode } from "../../../core/menu/MenuNode";

interface INavMenuProps {
    node: MenuNode;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: MenuNode) => void;
}

export const NavMenu = React.memo(({ currency, language, node, onPress }: INavMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView style={{ flex: 1, marginTop: 68 }} horizontal={false}
            >
                <GridList style={{ flex: 1 }} padding={10} spacing={6} data={node.activeChildren} itemDimension={196}
                    animationSkipFrames={10} renderItem={({ item }) => {
                        return <NavMenuItem key={item.id} node={item} currency={currency} language={language}
                            thumbnailHeight={128} onPress={onPress}></NavMenuItem>
                    }}
                    keyExtractor={(item, index) => item.id}>
                </GridList>
            </ScrollView>
        </SafeAreaView>
    );
});