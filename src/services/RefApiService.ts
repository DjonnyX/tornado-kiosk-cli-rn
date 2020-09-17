import { Observable, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType, ICurrency, IAd, IStore, ITerminal } from "@djonnyx/tornado-types";

class RefApiService {
    getRefs(): Observable<Array<IRef>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/refs`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getNodes(): Observable<Array<INode>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/nodes`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getSelectors(): Observable<Array<ISelector>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/selectors`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getProducts(): Observable<Array<IProduct>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/products`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getTags(): Observable<Array<ITag>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/tags`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getAssets(): Observable<Array<IAsset>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/assets`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getLanguages(): Observable<Array<ILanguage>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/languages`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getTranslations(): Observable<Array<ITranslation>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/translations`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getBusinessPeriods(): Observable<Array<IBusinessPeriod>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/business-periods`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getOrderTypes(): Observable<Array<IOrderType>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/order-types`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getCurrencies(): Observable<Array<ICurrency>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/currencies`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getAds(): Observable<Array<IAd>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/ads`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getStores(): Observable<Array<IStore>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/stores`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }

    getTerminals(): Observable<Array<ITerminal>> {
        return from(
            fetch(`${config.refServer.address}/api/v1/terminals`,
            {
                method: "GET",
                headers: {
                    "x-auth-token": config.license.apiKey,
                }
            })
        ).pipe(
            switchMap(res => from(res.json())),
            map(resData => resData.data),
        );
    }
}

export const refApiService = new RefApiService();