import React from "react";
import { View, Modal } from "react-native";
import { theme } from "../../../theme";
import { ModalRollTop } from "../ModalRollTop";

interface IModifiersEditorProps {
    visible: boolean;
}

export const ModifiersEditor = React.memo(({ visible }: IModifiersEditorProps) => {
    return (
        <ModalRollTop visible={visible}>
            <View>
            </View>
        </ModalRollTop>
    );
})