import React, { useState } from "react";
import { View, Image, Text, Modal, TouchableOpacity } from "react-native";
import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";

interface IOrderTypesPickerProps {
    orderTypes: Array<ICompiledOrderType>;
    language: ICompiledLanguage;
    onSelect: (orderType: ICompiledOrderType) => void;
}

export const OrderTypesPicker = ({ language, orderTypes, onSelect }: IOrderTypesPickerProps) => {
    const [currentOrderType, _setCurrentOrderTypes] = useState(orderTypes[0]);
    const [modalVisible, _setModalVisible] = useState(false);

    const setCurrentOrderTypes = (orderType: ICompiledOrderType) => {
        _setCurrentOrderTypes(prevOrderType => {
            return orderType;
        });
    };

    const setModalVisible = (value: boolean) => {
        _setModalVisible(prevVisibility => value);
    }

    const pressHandler = () => {
        setModalVisible(true);
    }

    const selectHandler = (orderType: ICompiledOrderType) => {
        setCurrentOrderTypes(orderType);
        setModalVisible(false);
        onSelect(orderType);
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
                        <FlatList style={{ flexGrow: 0, padding: 12 }} data={orderTypes} renderItem={({ item }) => {
                            return <TouchableOpacity onPress={() => {
                                selectHandler(item);
                            }}>
                                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                                    <Image style={{ width: 128, height: 128, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.1)", marginBottom: 8 }} source={{
                                        uri: `file://${item.contents[language?.code]?.resources?.main?.mipmap.x128}`,
                                    }} resizeMode="cover"></Image>
                                    <Text style={{ fontSize: 16 }}>
                                        {
                                            item.contents[language?.code]?.name
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
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderColor: "rgba(0, 0, 0, 0.5)", borderRadius: 6, padding: 8 }}>
                    <Image style={{ width: 32, height: 32, marginRight: 8 }} source={{
                        uri: `file://${currentOrderType?.contents[language?.code]?.resources?.main?.mipmap.x128}`,
                    }}></Image>
                    <Text>
                        {
                            currentOrderType?.contents[language?.code]?.name
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}