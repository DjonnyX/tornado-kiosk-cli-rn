import React, { Dispatch, PureComponent } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { AlertContent, ModalTransparent } from "../components/simple";
import { NotificationActions } from "../store/actions";
import { NotificationSelectors } from "../store/selectors/NotificationSelector";

interface IAlertServiceProps {
    // store
    _onClose?: () => void;
    _visible?: boolean;
    _title?: string;
    _message?: string;
}

interface IAlertServiceState { }

class AlertServiceContainer extends PureComponent<IAlertServiceProps, IAlertServiceState> {

    private okHandler = () => {
        if (this.props._onClose !== undefined) {
            this.props._onClose();
        }
    }

    constructor(props: IAlertServiceProps) {
        super(props);
    }

    render() {
        const { _visible, _message, _title } = this.props;

        return <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, }}>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <ModalTransparent visible={Boolean(_visible)}>
                    <AlertContent
                        title={_title || ""}
                        message={_message || ""}
                        applyButtonTitle="Закрыть"
                        onApply={this.okHandler}
                    />
                </ModalTransparent>
                <View style={{ flex: 1, width: "100%", height: "100%" }}>
                    {
                        this.props.children
                    }
                </View>
            </View>
        </View>
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _visible: NotificationSelectors.selectAlert(state).visible,
        _title: NotificationSelectors.selectAlert(state).title,
        _message: NotificationSelectors.selectAlert(state).message,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const AlertService = connect(mapStateToProps, mapDispatchToProps)(AlertServiceContainer);