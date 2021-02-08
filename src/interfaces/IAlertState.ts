export interface IAlertState {
    visible?: boolean;
    title?: string;
    message?: string;
    closeButtonTitle?: string;
    onClose?: () => void;
}