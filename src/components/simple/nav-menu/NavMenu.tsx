import React from "react";
import { SafeAreaView } from "react-native";
import { ICompiledMenu, ICompiledMenuNode } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";

interface INavMenuProps {
    node: ICompiledMenu;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const NavMenu = ({ languageCode, node, onPress }: INavMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{padding: 20, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }} horizontal={false}>
                {
                    node.children.map(child =>
                        <NavMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></NavMenuItem>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
}