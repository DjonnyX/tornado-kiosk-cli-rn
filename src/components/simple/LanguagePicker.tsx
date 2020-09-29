import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, Modal, Alert, TouchableHighlight } from "react-native";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import Video from "react-native-video";
import { FlatList } from "react-native-gesture-handler";

interface ILanguagePickerProps {
    languages: Array<ICompiledLanguage>;
    defaultLanguageCode: string;
    onSelect: (lang: ICompiledLanguage) => void;
}

export const LanguagePicker = ({ defaultLanguageCode, languages, onSelect }: ILanguagePickerProps) => {
    const [currentLanguage, _setCurrentLanguage] = useState(languages.find(lang => lang.code === defaultLanguageCode));
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
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 48 }}>
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
                            return <TouchableHighlight onPress={() => {
                                selectHandler(item);
                            }}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                                    <Image style={{ width: 128, height: 128, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', marginBottom: 8 }} source={{
                                        uri: `file://${item?.resources?.main?.mipmap.x128}`,
                                    }} resizeMode="cover"></Image>
                                    <Text style={{ fontSize: 16 }}>
                                        {
                                            item?.name
                                        }
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        }}>
                        </FlatList>
                    </View>
                </View>
            </Modal>
            <TouchableHighlight style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} onPress={pressHandler}>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: "rgba(0, 0, 0, 0.5)", borderRadius: 6, padding: 8 }}>
                    <Image style={{ width: 32, height: 32, marginRight: 8 }} source={{
                        uri: `file://${currentLanguage?.resources?.main?.mipmap.x32}`,
                    }}></Image>
                    <Text>
                        {
                            currentLanguage?.name
                        }
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    );
}