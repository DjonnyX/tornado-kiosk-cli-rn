import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { ICompiledOrderType, ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import { ModalSolid } from "./ModalSolid";
import { config } from "../../Config";

interface IOrderTypesPickerProps {
    theme: IKioskThemeData;
    isShow: boolean;
    orderTypes: Array<ICompiledOrderType>;
    language: ICompiledLanguage;
    orderType: ICompiledOrderType;
    onSelect: (orderType: ICompiledOrderType) => void;
    style: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
}

export const OrderTypesPicker = React.memo(({ theme, language, isShow, orderType, orderTypes, style,
    textStyle, onSelect }: IOrderTypesPickerProps) => {
    const [currentOrderType, _setCurrentOrderTypes] = useState(orderType);
    const [modalVisible, _setModalVisible] = useState(false);

    useEffect(() => {
        _setCurrentOrderTypes(orderType);
    }, [orderType]);

    useEffect(() => {
        if (isShow) {
            _setModalVisible(true);
        }
    }, [isShow]);

    const onPressHandler = useCallback(() => {
        _setModalVisible(true);
    }, []);

    const onSelectHandler = useCallback((orderType: ICompiledOrderType) => {
        _setModalVisible(false);
        onSelect(orderType);
    }, []);

    return (
        <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: 48 }}>
            <ModalSolid theme={theme} visible={modalVisible}>
                <FlatList style={{ flexGrow: 0, padding: 12 }} data={orderTypes} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={() => {
                        onSelectHandler(item);
                    }}>
                        <View style={{
                            flexDirection: "column", alignItems: "center", justifyContent: "center",
                            borderWidth: 1,
                            borderColor: theme.orderTypeModal.item.borderColor,
                            backgroundColor: theme.orderTypeModal.item.backgroundColor,
                            borderRadius: 16, marginBottom: 8, padding: 12,
                        }}>
                            <FastImage style={{
                                width: 128, height: 128,
                            }} source={{
                                uri: `file://${item.contents[language?.code]?.resources?.main?.mipmap.x128}`,
                            }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                            <Text style={{
                                fontFamily: config.fontFamilyRegular,
                                fontWeight: "600",
                                color: theme.orderTypeModal.item.textColor,
                                fontSize: theme.orderTypeModal.item.textFontSize,
                            }}>
                                {
                                    item.contents[language?.code]?.name
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                }}>
                </FlatList>
            </ModalSolid>
            <TouchableOpacity style={{
                flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%", borderRadius: 10,
                borderWidth: 2, borderColor: theme.orderTypePicker.borderColor,
            }}
                onPress={onPressHandler}>
                <View style={{
                    flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, ...style as any
                }}>
                    <Text style={{
                        fontFamily: config.fontFamilyRegular,
                        fontSize: theme.orderTypePicker.textFontSize,
                        fontWeight: "600",
                        textAlign: "center",
                        ...textStyle as any
                    }}>
                        {
                            currentOrderType?.contents[language?.code]?.name
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
})