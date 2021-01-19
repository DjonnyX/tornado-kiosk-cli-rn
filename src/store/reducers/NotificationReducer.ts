import { Reducer } from "redux";
import { NotificationActionTypes, TNotificationActions } from "../actions/NotificationAction";
import { INotificationState } from "../state";

const initialState: INotificationState = {
    alert: {
        visible: false,
        title: "",
        message: "",
    },
};

const notificationReducer: Reducer<INotificationState, TNotificationActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case NotificationActionTypes.SET_ALERT:
            return {
                ...state,
                alert: action.alert,
            };
        default:
            return state;
    }
};

export default notificationReducer;