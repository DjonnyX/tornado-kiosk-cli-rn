import React, { Dispatch, PureComponent } from "react";
import { GestureResponderEvent, View } from "react-native";
import { connect } from "react-redux";
import { ICompiledData } from "@djonnyx/tornado-types";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { config } from "../Config";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions } from "../store/actions";
import { CapabilitiesSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";

interface IUserIdleServiceProps {
    // store
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self
    onIdle: () => void;
    children: JSX.Element;
}

interface IUserIdleServiceState { }

class UserIdleServiceContainer extends PureComponent<IUserIdleServiceProps, IUserIdleServiceState> {

    private _timer: NodeJS.Timer | undefined;

    private _touchProcessHandler = (e: GestureResponderEvent): void => {
        if (this._timer) {
            clearTimeout(this._timer);
        }

        this.runTimer();
    }

    private _onIdle = () => {
        switch (this.props._currentScreen) {
            case MainNavigationScreenTypes.LOADING:
            case MainNavigationScreenTypes.INTRO:
                return;
        }

        this.props.onIdle();
    }

    constructor(props: IUserIdleServiceProps) {
        super(props);
    }

    private runTimer(): void {
        this._timer = setTimeout(this._onIdle,
            config.capabilities.userIdleTimeout);
    }

    render() {
        return <View style={{ flex: 1, width: "100%", height: "100%" }} onTouchStart={this._touchProcessHandler} onTouchEnd={this._touchProcessHandler}>
            {
                this.props.children
            }
        </View>
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectCurrentScreen(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onChange: (data: ICompiledData) => {
            dispatch(CombinedDataActions.setData(data));
            dispatch(CapabilitiesActions.setLanguage(data.refs.defaultLanguage));
            dispatch(CapabilitiesActions.setOrderType(data.refs.orderTypes[0]));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const UserIdleService = connect(null, mapDispatchToProps)(UserIdleServiceContainer);