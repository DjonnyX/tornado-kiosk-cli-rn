import React, { Dispatch, PureComponent } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { AlertContent, ModalTransparent } from "../components/simple";
import { NotificationActions } from "../store/actions";
import { NotificationSelectors } from "../store/selectors/NotificationSelector";
import { IAlertState } from "../interfaces";

interface IAlertServiceProps {
    // store
    _alertParams: IAlertState;
}

interface IAlertServiceState { }

class AlertServiceContainer extends PureComponent<IAlertServiceProps, IAlertServiceState> {
    constructor(props: IAlertServiceProps) {
        super(props);
    }

    render() {
        const { _alertParams } = this.props;

        return <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, }}>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <ModalTransparent visible={Boolean(_alertParams.visible)}>
                    <AlertContent
                        title={_alertParams.title || ""}
                        message={_alertParams.message || ""}
                        buttons={_alertParams.buttons || []}
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
        _alertParams: NotificationSelectors.selectAlert(state),
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