import React from "react";
import { SafeAreaView } from "react-native";
import { ICompiledMenu, ICompiledMenuNode } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";

interface INavMenuProps {
    menu: ICompiledMenu;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const NavMenu = ({ languageCode, menu, onPress }: INavMenuProps) => {
    return (
        <SafeAreaView style={{ display: 'flex', width: '100%', height: '100%' }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} horizontal={false}>
                {
                    menu.children.map(child =>
                        <NavMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></NavMenuItem>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
}