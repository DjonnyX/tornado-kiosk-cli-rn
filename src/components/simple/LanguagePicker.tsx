import React, { useState } from "react";
import { View, Image, Text, Modal, TouchableOpacity } from "react-native";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";

interface ILanguagePickerProps {
    languages: Array<ICompiledLanguage>;
    language: ICompiledLanguage;
    onSelect: (lang: ICompiledLanguage) => void;
}

export const LanguagePicker = ({ language, languages, onSelect }: ILanguagePickerProps) => {
    const [currentLanguage, _setCurrentLanguage] = useState(languages.find(lang => lang.code === language.code));
    const [modalVisible, _setModalVisible] = useState(false);

    const setCurrentLanguage = (lang: ICompiledLanguage) => {
        _setCurrentLanguage(prevLang => {
            return lang;
        });
    };

    const setModalVisible = (value: boolean) => {
        _setModalVisible(prevVisibility => value);
    }

    const pressHandler = () => {
        setModalVisible(true);
    }

    const selectHandler = (lang: ICompiledLanguage) => {
        setCurrentLanguage(lang);
        setModalVisible(false);
        onSelect(lang);
    }

    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: 48 }}>
            <Modal
                animationType="slide"
                visible={modalVisible}
                presentationStyle="fullScreen"
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}>
                    <View style={{
                        margin: 20,
                        backgroundColor: "white",
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
                                    <Image style={{ width: 128, height: 128, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.1)", marginBottom: 8 }} source={{
                                        uri: `file://${item?.resources?.main?.mipmap.x128}`,
                                    }} resizeMode="cover"></Image>
                                    <Text style={{ fontSize: 16 }}>
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
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "rgba(0, 0, 0, 0.5)", padding: 8, overflow: "hidden", width: 64, height: 64, borderRadius: 32 }}>
                    <Image style={{ position: "absolute", width: 96, height: 96 }} source={{
                        uri: `file://${currentLanguage?.resources?.main?.mipmap.x128}`,
                    }} resizeMode="cover"></Image>
                </View>
            </TouchableOpacity>
        </View>
    );
}