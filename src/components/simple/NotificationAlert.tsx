import React, { useEffect } from "react";
import { Text } from "react-native";
import { theme } from "../../theme";
import { NotificationModal } from "./NotificationModal";

interface INotificationAlertProps {
    message: string;
    visible: boolean;
    duration: number;
    onComplete: () => void;
}

export const NotificationAlert = React.memo(({ message, duration, visible, onComplete }: INotificationAlertProps) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onComplete();
        }, duration);

        return () => {
            clearTimeout(timeout);
        }
    }, [visible, duration, message]);
    return (
        <NotificationModal visible={visible}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.themes[theme.name].common.notificationAlert.textColor }}>{message}</Text>
        </NotificationModal>
    );
})