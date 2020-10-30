import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import { ModalSolid } from "./ModalSolid";

interface IOrderTypesPickerProps {
    orderTypes: Array<ICompiledOrderType>;
    language: ICompiledLanguage;
    onSelect: (orderType: ICompiledOrderType) => void;
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
}

export const OrderTypesPicker = React.memo(({ language, orderTypes, style, textStyle, onSelect }: IOrderTypesPickerProps) => {
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

    const pressHandler = useCallback(() => {
        setModalVisible(true);
    }, []);

    const selectHandler = useCallback((orderType: ICompiledOrderType) => {
        setCurrentOrderTypes(orderType);
        setModalVisible(false);
        onSelect(orderType);
    }, []);

    return (
        <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: 48 }}>
            <ModalSolid visible={modalVisible}>
                <FlatList style={{ flexGrow: 0, padding: 12 }} data={orderTypes} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={() => {
                        selectHandler(item);
                    }}>
                        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                            <FastImage style={{ width: 128, height: 128, borderWidth: 1, borderColor: theme.themes[theme.name].orderTypeModal.item.borderColor, marginBottom: 8 }} source={{
                                uri: `file://${item.contents[language?.code]?.resources?.main?.mipmap.x128}`,
                            }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                            <Text style={{ fontSize: 16, color: theme.themes[theme.name].orderTypeModal.item.textColor }}>
                                {
                                    item.contents[language?.code]?.name
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                }}>
                </FlatList>
            </ModalSolid>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} onPress={pressHandler}>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderRadius: 6, padding: 8, ...style as any }}>
                    {
                        /*
                        <Image style={{ width: 32, height: 32, marginRight: 8 }} source={{
                            uri: `file://${currentOrderType?.contents[language?.code]?.resources?.main?.mipmap.x128}`,
                        }}></Image>
                        */
                    }
                    <Text style={{ textTransform: "uppercase", ...textStyle as any }}>
                        {
                            currentOrderType?.contents[language?.code]?.name
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
})