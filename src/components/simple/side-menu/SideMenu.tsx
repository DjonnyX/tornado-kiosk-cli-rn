import React from "react";
import { SafeAreaView, View } from "react-native";
import { ICompiledMenu, ICompiledMenuNode } from "@djonnyx/tornado-types";
import { SideMenuItem } from "./SideMenuItem";
import { ScrollView } from "react-native-gesture-handler";

interface ISideMenuProps {
    menu: ICompiledMenu;
    languageCode: string;
    onPress: (ad: ICompiledMenuNode) => void;
}

export const SideMenu = ({ languageCode, menu, onPress }: ISideMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <ScrollView horizontal={false}>
                <View style={{ padding: 10 }}>
                    {
                        menu.children.map(child =>
                            <SideMenuItem key={child.id} node={child} languageCode={languageCode} onPress={onPress}></SideMenuItem>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}