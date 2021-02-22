import { Observable, from, throwError, of } from "rxjs";
import { catchError, map, retry, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType, ICurrency, IAd, IStore, ITerminal, TerminalTypes, ILicense } from "@djonnyx/tornado-types";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";
import { AuthStore } from "../native";
import { extractError } from "../utils/error";

const ERR_PATTERN = /(Error: )([\w]*)/gm;

const extractErrorType = (err: string) => {
    if (!!err) {
        const s = err.match(ERR_PATTERN);
        if (!!s && s.length > 0) {
            return s[0].replace(/Error: /g, "");
        }
    }

    return "Unknown error.";
}

interface IRequestOptions {
    useAttempts?: boolean;
    breakAfter?: number;
}

interface IApiRequestOptions {
    serial?: string;
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
    if (res.ok) {
        return from(res.json()).pipe(
            map(data => {
                const err = extractError(data.error);
                if (!!err) {
                    return throwError(err);
                }

                return data;
            }),
        );
    }

    return of(res).pipe(
        switchMap(res => from(res.text()).pipe(
            catchError(err => {
                switch (res.status) {
                    case 504:
                        return throwError("Ошибка в соединении.");
                }
                switch (res.status) {
                    case 401:
                        return throwError("Некорректная лицензия.");
                    case 504:
                        return throwError("Ошибка в соединении.");
                }

                return throwError(res.statusText);
            }),
            switchMap(text => {
                const errType = extractErrorType(text);
                switch (errType) {
                    case "TokenBadFormat":
                        return throwError(Error("Неверный формат токена"));
                    case "LicenseNotFound":
                        return throwError(Error("Лицензия не найдена"));
                    case "LicensePeriodIsFinish":
                        return throwError(Error("Истек срок действия лицензии"));
                    case "TokenExpiredError":
                        return throwError(Error("Ошибка проверки подлинности ключа (054)"));
                    default:
                        return throwError(Error("Неизвестная ошибка"));
                }
            }),
        )),
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

    async getAccessToken(options?: IApiRequestOptions): Promise<string> {
        return AuthStore.getToken(options?.serial || this._serial || "", config.refServer.apiKeyTokenSalt);
    }

    terminalLicenseVerify(serial: string): Observable<ILicense> {
        Log.i("RefApiService", "terminalLicenseVerify");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/device/license-verify`,
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

    terminalRegistration(serial: string): Observable<ITerminal> {
        Log.i("RefApiService", "terminalRegistry");
        return request(
            from(AuthStore.getToken(serial, config.refServer.apiKeyTokenSalt)).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/device/registration`,
                            {
                                method: "POST",
                                headers: {
                                    "x-access-token": token,
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    type: TerminalTypes.KIOSK,
                                }),
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

    terminalSetParams(id: string, params: { name: string, storeId: string }): Observable<ITerminal> {
        Log.i("RefApiService", "terminalSetParams");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.refServer.address}/api/v1/terminal/${id}`,
                            {
                                method: "PUT",
                                headers: {
                                    "x-access-token": token,
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(params),
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("RefApiService", "> terminalSetParams: " + err);
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

    getStores(options?: IApiRequestOptions): Observable<Array<IStore>> {
        Log.i("RefApiService", "getStores");
        return request(
            from(this.getAccessToken(options)).pipe(
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
            catchError(err => {
                return throwError(err);
            }),
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