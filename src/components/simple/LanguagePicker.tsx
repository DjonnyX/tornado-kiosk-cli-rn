import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import Color from "color";
import { theme } from "../../theme";

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
            <Modal
                animationType="slide"
                visible={modalVisible}
                presentationStyle="fullScreen"
                statusBarTranslucent={true}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: theme.themes[theme.name].common.modal.background,
                }}>
                    <View style={{
                        margin: 20,
                        backgroundColor: theme.themes[theme.name].common.modal.window.background,
                        borderRadius: 8,
                        padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 8,
                    }}>
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
                    </View>
                </View>
            </Modal>
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