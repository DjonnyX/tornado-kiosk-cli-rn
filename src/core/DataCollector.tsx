import { Component } from "react";
import { from, of, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { IAsset } from "@djonnyx/tornado-types";
import { AssetsStore } from "@djonnyx/tornado-assets-store";
import { DataCombiner } from "@djonnyx/tornado-refs-processor";
import { ExternalStorage } from "../native";
import { config } from "../Config";
import { refApiService, assetsService, fsService } from "../services";

interface IDataCollectorProps {

}

interface IDataCollectorState {

}

const APP_CACHE_DIR_NAME = "tornado-app";

export class DataCollector extends Component<IDataCollectorProps, IDataCollectorState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _assetsStore: AssetsStore | null = null;

    private _dataCombiner: DataCombiner | null = null;

    constructor(props: IDataCollectorProps) {
        super(props);
    }

    async componentDidMount() {
        let userDataPath: string | undefined = undefined;

        try {
            const isStorageAvailable = await ExternalStorage.isStorageAvailable();
            const isStorageReadOnly = await ExternalStorage.isStorageReadOnly();

            if (isStorageAvailable && !isStorageReadOnly) {
                userDataPath = await ExternalStorage.getPath();
            }
        } catch (err) {
            console.warn(err);
        }

        const storePath = `${userDataPath}/${APP_CACHE_DIR_NAME}/assets`;

        this._assetsStore = new AssetsStore(storePath, fsService, assetsService);

        this._dataCombiner = new DataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
                return this._assetsStore?.setManifest(assets) || of(assets);
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._dataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            data => {
                console.log(data);
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
}