import React from "react";
import { SafeAreaView, View } from "react-native";
import { ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { SideMenuItem } from "./SideMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { MenuNode } from "../../../core/menu/MenuNode";

interface ISideMenuProps {
    theme: IKioskThemeData;
    menu: MenuNode;
    selected: MenuNode;
    language: ICompiledLanguage;
    onPress: (category: MenuNode) => void;
}

export const SideMenu = React.memo(({ theme, selected, language, menu, onPress }: ISideMenuProps) => {
    return (
        <SafeAreaView style={{
            flex: 1, width: "100%", height: "100%",
        }}>
            <ScrollView horizontal={false}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 12, }}>
                    {
                        menu.activeChildren.map(child =>
                            <SideMenuItem key={child.id} theme={theme} selected={selected} node={child} language={language}
                                onPress={onPress}></SideMenuItem>
                        )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
});