import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { from, of, Subject } from "rxjs";
import { take, takeUntil, filter } from "rxjs/operators";
import { IAsset, ICompiledData, IRefs } from "@djonnyx/tornado-types";
import { AssetsStore, IAssetsStoreResult } from "@djonnyx/tornado-assets-store";
import { DataCombiner } from "@djonnyx/tornado-refs-processor";
import { ExternalStorage } from "../native";
import { config } from "../Config";
import { assetsService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { GestureResponderEvent, TouchableWithoutFeedback } from "react-native";

interface IUserIdleServiceProps {
    // store
    _onChange: (data: ICompiledData) => void;
    _onProgress: (progress: IProgress) => void;

    // self
    children: JSX.Element;
}

interface IUserIdleServiceState { }

class UserIdleServiceContainer extends Component<IUserIdleServiceProps, IUserIdleServiceState> {

    private _clickHandler = (e: GestureResponderEvent): void => {
        console.warn("user click")
    }

    constructor(props: IUserIdleServiceProps) {
        super(props);
    }

    render() {
        return <TouchableWithoutFeedback onPress={this._clickHandler}>
            {
                this.props.children
            }
        </TouchableWithoutFeedback>;
    }
}

const mapStateToProps = (state: IAppState) => {
    return {};
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