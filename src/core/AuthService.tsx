import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { ExternalStorage } from "../native";
import { assetsService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { SystemActions } from "../store/actions/SystemAction";
import { SystemSelectors } from "../store/selectors";
import { IDeviceInfo } from "./interfaces";

interface IAuthServiceProps {
    // store
    _onChangeDeviceInfo: (deviceInfo: IDeviceInfo | null) => void;
    // _onProgress: (progress: IProgress) => void;

    // self
    _serialNumber: string | undefined;
    _name: string | undefined;
}

interface IAuthServiceState { }

const DEVICE_INFO = "device.json";

class AuthServiceContainer extends Component<IAuthServiceProps, IAuthServiceState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _deviceInfo: IDeviceInfo | null = null;

    private _storePath: string | undefined = undefined;

    constructor(props: IAuthServiceProps) {
        super(props);
    }

    private async saveDeviceInfo(deviceInfo: IDeviceInfo): Promise<void> {
        try {
            await assetsService.writeFile(`${this._storePath}/${DEVICE_INFO}`, deviceInfo);
        } catch (err) {
            // etc
        }
    }

    shouldComponentUpdate(nextProps: Readonly<IAuthServiceProps>, nextState: Readonly<IAuthServiceState>, nextContext: any) {
        if (this.props._serialNumber !== nextProps._serialNumber) {
            this.saveDeviceInfo({ ...this._deviceInfo, serialNumber: nextProps._serialNumber });
        }

        if (super.shouldComponentUpdate) return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        return true;
    }

    async componentDidMount() {
        let userDataPath: string | undefined = undefined;

        try {
            const isStorageAvailable = await ExternalStorage.isStorageAvailable();
            const isStorageWritable = await ExternalStorage.isStorageWritable();

            if (isStorageAvailable && !isStorageWritable) {
                userDataPath = await ExternalStorage.getPath();
            }
        } catch (err) {
            console.warn(err);
            return;
        }

        this._storePath = `${userDataPath}/system`;

        try {
            if (!await assetsService.exists(this._storePath)) {
                await assetsService.mkdir(this._storePath);
            }
        } catch (err) {
            console.warn(err, this._storePath);
        }

        try {
            this._deviceInfo = await assetsService.readFile(`${this._storePath}/${DEVICE_INFO}`);
            console.warn(this._deviceInfo);
        } catch (err) {
            console.warn("DeviceInfo not found.");
        }

        this.props._onChangeDeviceInfo(this._deviceInfo);
    }

    componentWillUnmount() {
        if (!!this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
            this._unsubscribe$ = null;
        }
    }

    render() {
        return <></>;
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _serialNumber: SystemSelectors.selectSerialNumber(state),
        _name: SystemSelectors.selectTerminalName(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onChangeDeviceInfo: (data: IDeviceInfo | null) => {
            dispatch(SystemActions.setSerialNumber(data?.serialNumber));
            dispatch(SystemActions.setName(data?.name));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const AuthService = connect(mapStateToProps, mapDispatchToProps)(AuthServiceContainer);