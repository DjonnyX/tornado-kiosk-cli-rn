import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ICompiledMenu, ICompiledMenuNode, ICompiledLanguage } from "@djonnyx/tornado-types";
import { SideMenuItem } from "./SideMenuItem";
import { ScrollView } from "react-native-gesture-handler";

interface ISideMenuProps {
    menu: ICompiledMenu;
    selected: ICompiledMenuNode;
    language: ICompiledLanguage;
    onPress: (category: ICompiledMenuNode) => void;
}

export const SideMenu = ({ selected, language, menu, onPress }: ISideMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView horizontal={false}>
                <View style={{ paddingLeft: 32, paddingRight: 20, paddingTop: 78, paddingBottom: 10 }}>
                    {
                        menu.children.map(child =>
                            <SideMenuItem key={child.id} selected={selected} node={child} language={language} onPress={onPress}></SideMenuItem>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}