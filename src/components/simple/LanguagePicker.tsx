import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import Color from "color";
import { theme } from "../../theme";
import { ModalSolid } from "./ModalSolid";

interface ILanguagePickerProps {
    languages: Array<ICompiledLanguage>;
    language: ICompiledLanguage;
    onSelect: (lang: ICompiledLanguage) => void;
}

export const LanguagePicker = React.memo(({ language, languages, onSelect }: ILanguagePickerProps) => {
    const [currentLanguage, _setCurrentLanguage] = useState(languages.find(lang => lang.code === language.code));
    const [modalVisible, _setModalVisible] = useState(false);

    const setCurrentLanguage = useCallback((lang: ICompiledLanguage) => {
        _setCurrentLanguage(prevLang => {
            return lang;
        });
    }, []);

    const setModalVisible = useCallback((value: boolean) => {
        _setModalVisible(prevVisibility => value);
    }, []);

    const pressHandler = useCallback(() => {
        setModalVisible(true);
    }, []);

    const selectHandler = useCallback((lang: ICompiledLanguage) => {
        setCurrentLanguage(lang);
        setModalVisible(false);
        onSelect(lang);
    }, []);

    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: 48 }}>
            <ModalSolid visible={modalVisible}>
                <FlatList style={{ flexGrow: 0, padding: 12 }} data={languages} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={() => {
                        selectHandler(item);
                    }}>
                        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                            <FastImage style={{ width: 128, height: 128, borderWidth: 1, borderColor: theme.themes[theme.name].languageModal.item.borderColor, marginBottom: 8 }} source={{
                                uri: `file://${item?.resources?.main?.mipmap.x128}`,
                            }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                            <Text style={{ fontSize: 16, color: theme.themes[theme.name].languageModal.item.textColor }}>
                                {
                                    item?.name
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                }}>
                </FlatList>
            </ModalSolid>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} onPress={pressHandler}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: theme.themes[theme.name].languageModal.item.borderColor, padding: 8, overflow: "hidden", width: 44, height: 44, borderRadius: 32 }}>
                    <FastImage style={{ position: "absolute", width: 64, height: 64 }} source={{
                        uri: `file://${currentLanguage?.resources?.main?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
            </TouchableOpacity>
        </View>
    );
})