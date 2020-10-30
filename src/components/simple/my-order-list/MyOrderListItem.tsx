import React, { useCallback, useState } from "react";
import { View, Text, Button } from "react-native";
import FastImage from "react-native-fast-image";
import { IOrderPosition, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { theme } from "../../../theme";
import { ModalTransparent } from "../ModalTransparent";
import { AlertContent } from "../AlertContent";

interface IMyOrderListItemItemProps {
    imageHeight: number;
    position: IOrderPosition;
    currency: ICurrency;
    language: ICompiledLanguage;
    onChange: (position: IOrderPosition) => void;
    onRemove: (position: IOrderPosition) => void;
}

export const MyOrderListItem = React.memo(({ imageHeight, currency, language, position, onChange, onRemove }: IMyOrderListItemItemProps) => {
    const [alertRemoveVisible, _setAlertRemoveVisible] = useState(false);

    const setAlertRemoveVisible = (value: boolean) => {
        _setAlertRemoveVisible(prevVisibility => value);
    };

    const currentContent = position.product.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const setQuantity = (qnt: number) => {
        const pos = { ...position };
        pos.quantity = qnt;
        onChange(pos);
    }

    const changeQuantityHandler = (value: number) => {
        if (value < 1) {
            setAlertRemoveVisible(true);
            return;
        }

        setQuantity(value);
    };

    const cancelRemovePositionHandler = useCallback(() => {
        setAlertRemoveVisible(false);

        setQuantity(1);
    }, []);

    const removePositionHandler = useCallback(() => {
        onRemove(position);
    }, []);

    return (
        <View style={{ flex: 1, paddingLeft: 24, paddingRight: 24, marginBottom: 20 }}>
            <ModalTransparent visible={alertRemoveVisible}>
                <AlertContent
                    title="Внимание"
                    message="Удалить позицию из заказа?"
                    cancelButtonTitle="Отменить"
                    applyButtonTitle="Удалить"
                    onCancel={cancelRemovePositionHandler}
                    onApply={removePositionHandler}
                />
            </ModalTransparent>
            <View style={{ flex: 1, width: "100%", height: imageHeight, marginBottom: 2, justifyContent: "flex-end" }}>
                <FastImage style={{ width: "100%", height: "100%" }} source={{
                    uri: `file://${currentAdAsset?.mipmap.x128}`,
                }} resizeMode={FastImage.resizeMode.contain}></FastImage>
            </View>
            <Text numberOfLines={3} ellipsizeMode="tail" style={{
                textAlign: "center", fontSize: 12,
                color: theme.themes[theme.name].menu.draftOrder.item.nameColor, textTransform: "uppercase", fontWeight: "bold"
            }}>
                {
                    currentContent.name
                }
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 1 }}>
                <Text style={{ textAlign: "center", fontSize: 12, paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6, color: theme.themes[theme.name].menu.draftOrder.item.price.textColor }}>
                    {
                        `${(position.product.prices[currency.id as string]?.value * 0.01).toFixed(2)} ${currency.symbol}`
                    }
                </Text>
            </View>
            <NumericStapper
                value={position.quantity}
                buttonStyle={{
                    borderStyle: "solid", borderWidth: 0.5, borderRadius: 3,
                    borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.borderColor,
                    padding: 6
                }}
                buttonTextStyle={{
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textColor as any,
                }}
                textStyle={{ width: 44, color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textColor }}
                iconDecrement="-"
                iconIncrement="+"
                onChange={changeQuantityHandler}
            />
        </View>
    );
})