import { Observable, from, throwError } from "rxjs";
import { catchError, map, retry, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType, ICurrency, IAd, IStore, ITerminal, TerminalTypes } from "@djonnyx/tornado-types";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";
import { AuthStore } from "../native";
import { extractError } from "../utils/error";

interface IRequestOptions {
    useAttempts?: boolean;
    breakAfter?: number;
}

const request = (observable: Observable<Response>, options?: IRequestOptions): Observable<Response> => {
    if (options?.useAttempts) {
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

    return observable;
}

const parseResponse = (res: Response) => {
    let result: Observable<any>;
    result = from(res.json());

    if (res.ok) {
        return result;
    }

    return result.pipe(
        switchMap(data => {
            const err = extractError(data.error);
            if (err) {
                console.warn(err)
                return throwError(err);
            }

            return throwError(res.statusText);
        }),
    );
}

class RefApiService {
    private _serial: string | undefined;

    public set serial(v: string) {
        if (this._serial === v) {
            return;
        }

        this._serial = v;
    }

    async getAccessToken(): Promise<string> {
        return AuthStore.getToken(config.license.apiKey, config.refServer.apiKeyTokenSalt);
    }

    terminalLicenseVerify(serial: string): Observable<Array<any>> {
        Log.i("RefApiService", "terminalLicenseVerify");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminal/license-verify`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                },
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalLicenseVerify: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    terminalRegistration(serial: string, terminalName: string): Observable<Array<any>> { // ILicense
        Log.i("RefApiService", "terminalRegistry");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    console.warn(token, terminalName)
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminal/registration`,
                            {
                                method: "POST",
                                headers: {
                                    "x-access-token": token,
                                },
                                body: {
                                    type: TerminalTypes.KIOSK,
                                    terminalName,
                                }
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalRegistry: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    getRefs(): Observable<Array<IRef>> {
        Log.i("RefApiService", "getRefs");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/refs`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> getRefs: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }

    getNodes(): Observable<Array<INode>> {
        Log.i("RefApiService", "getNodes");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/nodes`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    )
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getSelectors(): Observable<Array<ISelector>> {
        Log.i("RefApiService", "getSelectors");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/selectors`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getProducts(): Observable<Array<IProduct>> {
        Log.i("RefApiService", "getProducts");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/products`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            })
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getTags(): Observable<Array<ITag>> {
        Log.i("RefApiService", "getTags");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/tags`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            retry(5),
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getAssets(): Observable<Array<IAsset>> {
        Log.i("RefApiService", "getAssets");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/assets`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getLanguages(): Observable<Array<ILanguage>> {
        Log.i("RefApiService", "getLanguages");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/languages`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getTranslations(): Observable<Array<ITranslation>> {
        Log.i("RefApiService", "getTranslations");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/translations`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getBusinessPeriods(): Observable<Array<IBusinessPeriod>> {
        Log.i("RefApiService", "getBusinessPeriods");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/business-periods`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getOrderTypes(): Observable<Array<IOrderType>> {
        Log.i("RefApiService", "getOrderTypes");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/order-types`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getCurrencies(): Observable<Array<ICurrency>> {
        Log.i("RefApiService", "getCurrencies");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/currencies`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getAds(): Observable<Array<IAd>> {
        Log.i("RefApiService", "getAds");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/ads`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getStores(): Observable<Array<IStore>> {
        Log.i("RefApiService", "getStores");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/stores`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }

    getTerminals(): Observable<Array<ITerminal>> {
        Log.i("RefApiService", "getTerminals");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminals`,
                            {
                                method: "GET",
                                headers: {
                                    "x-access-token": token,
                                }
                            }
                        )
                    );
                })
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            map(resData => resData.data),
        );
    }
}

export const refApiService = new RefApiService();