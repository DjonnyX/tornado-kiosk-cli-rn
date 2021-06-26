import React from "react";
import { SafeAreaView, View } from "react-native";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { SideMenuItem } from "./SideMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { MenuNode } from "../../../core/menu/MenuNode";

interface ISideMenuProps {
    themeName: string;
    menu: MenuNode;
    selected: MenuNode;
    language: ICompiledLanguage;
    onPress: (category: MenuNode) => void;
}

export const SideMenu = React.memo(({ themeName, selected, language, menu, onPress }: ISideMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView horizontal={false}>
                <View style={{ paddingLeft: 32, paddingRight: 20, paddingTop: 78, paddingBottom: 10 }}>
                    {
                        menu.activeChildren.map(child =>
                            <SideMenuItem key={child.id} themeName={themeName} selected={selected} node={child} language={language}
                                onPress={onPress}></SideMenuItem>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
});