import { Observable, from, throwError } from "rxjs";
import { map, retry, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType, ICurrency, IAd, IStore, ITerminal } from "@djonnyx/tornado-types";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";

const request = (observable: Observable<Response>): Observable<Response> => {
    return observable.pipe(
        retryWhen(
            genericRetryStrategy({
                rejectShortAttempts: 5, // 5 последовательных попыток
                rejectShortTimeout: 5000, // Раз в 5 сек
                rejectLongTimeout: 60000, // Раз в минуту переобновление
                excludedStatusCodes: [],
            }),
        ),
    );
}

class RefApiService {
    getRefs(): Observable<Array<IRef>> {
        Log.i("RefApiService", "getRefs");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/refs`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            )
        ).pipe(
            map(v => {
                if (v.ok) {
                    v.text().then((txt) => {
                        Log.i("RefApiService", "> getRefs: " + txt);
                    });
                } else {
                    Log.i("RefApiService", "> getRefs: " + v.statusText);
                }
                return v;
            }),
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data)
        );
    }

    getNodes(): Observable<Array<INode>> {
        Log.i("RefApiService", "getNodes");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/nodes`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getSelectors(): Observable<Array<ISelector>> {
        Log.i("RefApiService", "getSelectors");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/selectors`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getProducts(): Observable<Array<IProduct>> {
        Log.i("RefApiService", "getProducts");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/products`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getTags(): Observable<Array<ITag>> {
        Log.i("RefApiService", "getTags");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/tags`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            retry(5),
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getAssets(): Observable<Array<IAsset>> {
        Log.i("RefApiService", "getAssets");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/assets`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getLanguages(): Observable<Array<ILanguage>> {
        Log.i("RefApiService", "getLanguages");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/languages`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getTranslations(): Observable<Array<ITranslation>> {
        Log.i("RefApiService", "getTranslations");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/translations`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getBusinessPeriods(): Observable<Array<IBusinessPeriod>> {
        Log.i("RefApiService", "getBusinessPeriods");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/business-periods`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getOrderTypes(): Observable<Array<IOrderType>> {
        Log.i("RefApiService", "getOrderTypes");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/order-types`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getCurrencies(): Observable<Array<ICurrency>> {
        Log.i("RefApiService", "getCurrencies");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/currencies`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getAds(): Observable<Array<IAd>> {
        Log.i("RefApiService", "getAds");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/ads`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getStores(): Observable<Array<IStore>> {
        Log.i("RefApiService", "getStores");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/stores`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }

    getTerminals(): Observable<Array<ITerminal>> {
        Log.i("RefApiService", "getTerminals");
        return request(
            from(
                fetch(`${config.refServer.address}/api/v1/terminals`,
                    {
                        method: "GET",
                        headers: {
                            "x-auth-token": config.license.apiKey,
                        }
                    })
            ),
        ).pipe(
            switchMap(res => res.ok ? from(res.json()) : throwError(res.status)),
            map(resData => resData.data),
        );
    }
}

export const refApiService = new RefApiService();