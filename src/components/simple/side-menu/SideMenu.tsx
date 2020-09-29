import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { ICompiledMenu, ICompiledMenuNode } from "@djonnyx/tornado-types";
import { SideMenuItem } from "./SideMenuItem";
import { ScrollView } from "react-native-gesture-handler";

interface ISideMenuProps {
    menu: ICompiledMenu;
    languageCode: string;
    onPress: (category: ICompiledMenuNode) => void;
}

export const SideMenu = ({ languageCode, menu, onPress }: ISideMenuProps) => {
    const [category, setCategory] = useState(menu);

    const onSelect = (category: ICompiledMenuNode) => {
        setCategory(prevCategory => category);
        if (!!onPress) {
            onPress(category);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <ScrollView horizontal={false}>
                <View style={{ padding: 10, paddingTop: 78 }}>
                    {
                        menu.children.map(child =>
                            <SideMenuItem key={child.id} selected={category} node={child} languageCode={languageCode} onPress={onSelect}></SideMenuItem>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}