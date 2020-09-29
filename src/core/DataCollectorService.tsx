import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { from, of, Subject } from "rxjs";
import { take, takeUntil, filter } from "rxjs/operators";
import { IAsset, ICompiledData } from "@djonnyx/tornado-types";
import { AssetsStore, IAssetsStoreResult } from "@djonnyx/tornado-assets-store";
import { DataCombiner } from "@djonnyx/tornado-refs-processor";
import { ExternalStorage } from "../native";
import { config } from "../Config";
import { assetsService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";

interface IDataCollectorServiceProps {
    // store
    _onChange: (data: ICompiledData) => void;
    _onProgress: (progress: IProgress) => void;

    // self

}

interface IDataCollectorServiceState { }

// const APP_CACHE_DIR_NAME = "tornado";

class DataCollectorServiceContainer extends Component<IDataCollectorServiceProps, IDataCollectorServiceState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _assetsStore: AssetsStore | null = null;

    private _dataCombiner: DataCombiner | null = null;

    constructor(props: IDataCollectorServiceProps) {
        super(props);
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

        const storePath = `${userDataPath}/assets`; //${APP_CACHE_DIR_NAME}/

        this._assetsStore = new AssetsStore(storePath, assetsService, {
            createDirectoryRecurtion: false,
            maxThreads: 1,
        });

        this._dataCombiner = new DataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
                return this._assetsStore?.setManifest(assets) || {
                    onComplete: of(assets),
                    onProgress: of({ total: 0, current: 0 }),
                } as IAssetsStoreResult;
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._dataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                this.props._onChange(data);
            },
        );

        this._dataCombiner.onProgress.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            progress => {
                this.props._onProgress(progress);
            },
        );

        from(
            this._assetsStore.init(),
        ).pipe(
            take(1),
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(() => {
            this._dataCombiner?.init();
        });
    }

    componentWillUnmount() {
        if (!!this._dataCombiner) {
            this._dataCombiner.dispose();
            this._dataCombiner = null;
        }

        if (!!this._assetsStore) {
            this._assetsStore.dispose();
            this._assetsStore = null;
        }

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

export const DataCollectorService = connect(null, mapDispatchToProps)(DataCollectorServiceContainer);