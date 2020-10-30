import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { theme } from "../../theme";
import { SimpleButton } from "./SimpleButton";

interface IAlertContentProps {
    title: string;
    message: string;
    cancelButtonTitle: string;
    applyButtonTitle: string;
    onCancel: () => void;
    onApply: () => void;
}

export const AlertContent = React.memo(({ title, message, cancelButtonTitle, applyButtonTitle, onCancel, onApply }: IAlertContentProps) => {
    return (
        <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "column", marginBottom: 20 }}>
                <Text style={{ fontSize: 20, textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>{title}</Text>
                <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>{message}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <SimpleButton style={{ backgroundColor: "yellow", marginRight: 10 }} textStyle={{color: "rgba(0,0,0,0.75)"}} onPress={onCancel} title={cancelButtonTitle} />
                <SimpleButton style={{ backgroundColor: "yellow", }} textStyle={{color: "rgba(0,0,0,0.75)"}} onPress={onApply} title={applyButtonTitle} />
            </View>
        </View>
    );
})