import React, { useState, useCallback } from "react";
import { View, Modal } from "react-native";
import { theme } from "../../theme";

interface IModalSolidProps {
    children: JSX.Element;
    visible: boolean;
}

export const ModalSolid = React.memo(({ children, visible }: IModalSolidProps) => {
    return (
        <Modal
            animationType="slide"
            visible={visible}
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
                    {
                        children
                    }
                </View>
            </View>
        </Modal>
    );
})