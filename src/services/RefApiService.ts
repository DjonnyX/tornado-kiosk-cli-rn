import { Observable, from, throwError, of } from "rxjs";
import { catchError, map, retry, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IRef, INode, ISelector, IProduct, ITag, IAsset, ILanguage, ITranslation, IBusinessPeriod, IOrderType, ICurrency, IAd, IStore, ITerminal, TerminalTypes, ILicense } from "@djonnyx/tornado-types";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";
import { AuthStore } from "../native";
import { extractError } from "../utils/error";
import { ApiErrorCodes } from "./ApiErrorCodes";

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
    return from(res.json()).pipe(
        catchError(err => {
            switch (res.status) {
                case 401:
                    return throwError("Некорректная лицензия.");
                case 504:
                    return throwError("Ошибка в соединении.");
                default:
                    return throwError("Неизвестная ошибка.");
            }
        }),
        switchMap(data => {
            if (!!data.error && data.error.length > 0) {
                let errText = "";
                switch (data.error[0].code) {
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_CHECK_LICENSE_ERROR:
                        errText = "Ошибка при проверке лицензии";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_METHOD_NOT_ALLOWED:
                        errText = "Метод не доступен";
                        break;
                    case ApiErrorCodes.REF_CLIENT_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_EMPTY_TOKEN:
                        errText = "Токен не задан";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_VERIFICATION:
                        errText = "Внутренняя ошибка сервера";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_FINISHED:
                        errText = "Срок действия лицензии прошел";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_NOT_FOUND:
                        errText = "Лицензия не найдена";
                        break;
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    default: {
                        return throwError(extractError(data.error) || `Неизвестная ошибка (${data.error[0].code})`);
                    }
                }
                return throwError(`${errText} (${data.error[0].code})`);
            }

            return of(data);
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

    async getAccessToken(options?: IApiRequestOptions): Promise<string> {
        return AuthStore.getToken(options?.serial || this._serial || "", config.refServer.apiKeyTokenSalt);
    }

    terminalLicenseVerify(serial: string): Observable<ILicense> {
        Log.i("RefApiService", "terminalLicenseVerify");
        let response: Observable<ILicense>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    terminalRegistration(serial: string): Observable<ITerminal> {
        Log.i("RefApiService", "terminalRegistry");
        let response: Observable<ITerminal>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    terminalSetParams(id: string, params: { name: string, storeId: string }): Observable<ITerminal> {
        Log.i("RefApiService", "terminalSetParams");
        let response: Observable<ITerminal>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getRefs(): Observable<Array<IRef>> {
        Log.i("RefApiService", "getRefs");
        let response: Observable<Array<IRef>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getNodes(): Observable<Array<INode>> {
        Log.i("RefApiService", "getNodes");
        let response: Observable<Array<INode>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getSelectors(): Observable<Array<ISelector>> {
        Log.i("RefApiService", "getSelectors");
        let response: Observable<Array<ISelector>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getProducts(): Observable<Array<IProduct>> {
        Log.i("RefApiService", "getProducts");
        let response: Observable<Array<IProduct>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getTags(): Observable<Array<ITag>> {
        Log.i("RefApiService", "getTags");
        let response: Observable<Array<IProduct>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getAssets(): Observable<Array<IAsset>> {
        Log.i("RefApiService", "getAssets");
        let response: Observable<Array<IAsset>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getLanguages(): Observable<Array<ILanguage>> {
        Log.i("RefApiService", "getLanguages");
        let response: Observable<Array<ILanguage>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getTranslations(): Observable<Array<ITranslation>> {
        Log.i("RefApiService", "getTranslations");
        let response: Observable<Array<ITranslation>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getBusinessPeriods(): Observable<Array<IBusinessPeriod>> {
        Log.i("RefApiService", "getBusinessPeriods");
        let response: Observable<Array<IBusinessPeriod>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getOrderTypes(): Observable<Array<IOrderType>> {
        Log.i("RefApiService", "getOrderTypes");
        let response: Observable<Array<IOrderType>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getCurrencies(): Observable<Array<ICurrency>> {
        Log.i("RefApiService", "getCurrencies");
        let response: Observable<Array<ICurrency>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getAds(): Observable<Array<IAd>> {
        Log.i("RefApiService", "getAds");
        let response: Observable<Array<IAd>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getStores(options?: IApiRequestOptions): Observable<Array<IStore>> {
        Log.i("RefApiService", "getStores");
        let response: Observable<Array<IStore>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getTerminals(): Observable<Array<ITerminal>> {
        Log.i("RefApiService", "getTerminals");
        let response: Observable<Array<ITerminal>>;
        try {
            response = request(
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
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }
}

export const refApiService = new RefApiService();