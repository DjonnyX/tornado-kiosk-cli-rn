import React from "react";
import { View, Modal } from "react-native";
import { theme } from "../../theme";

interface INotificationModalProps {
    children: JSX.Element;
    visible: boolean;
}

export const NotificationModal = React.memo(({ children, visible }: INotificationModalProps) => {
    return (
        <Modal
            animationType="slide"
            visible={visible}
            presentationStyle="overFullScreen"
            transparent={true}
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
            }}>
                <View style={{
                    margin: 20,
                    borderWidth: 1,
                    borderColor: theme.themes[theme.name].common.modalTransparent.window.borderColor,
                    backgroundColor: theme.themes[theme.name].common.modalTransparent.window.background,
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