import { Action } from "redux";
import { IAlertState } from "../../interfaces";

export enum NotificationActionTypes {
    SET_ALERT = "TORNADO/system/set-alert",
}

interface INotificationSetAlert extends Action<NotificationActionTypes.SET_ALERT> {
    alert: IAlertState;
}

export class NotificationActions {
    static alertOpen = (alert: IAlertState): INotificationSetAlert => ({
        type: NotificationActionTypes.SET_ALERT,
        alert: { ...alert, visible: true },
    });

    static alertClose = (): INotificationSetAlert => ({
        type: NotificationActionTypes.SET_ALERT,
        alert: {
            visible: false,
            title: "",
            message: "",
            closeButtonTitle: "Закрыть",
            onClose: undefined,
        },
    });
}

export type TNotificationActions = INotificationSetAlert;