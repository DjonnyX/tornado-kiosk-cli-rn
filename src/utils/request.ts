import { from, Observable, throwError, timer } from "rxjs";
import { finalize, map, repeatWhen, retryWhen, switchMap } from "rxjs/operators";

export interface IRetryStrategyOptions<E = any> {
    rejectShortAttempts?: number;
    rejectLongAttempts?: number;
    rejectShortTimeout?: number;
    rejectLongTimeout?: number;
    excludedStatusCodes?: Array<number>;
    onRetry?: (err: E) => void;
}

export interface IRepeatStrategyOptions<T = any> {
    updateTimeout?: number;
    onRepeat?: (data: T) => void;
}

const DEFAULT_ERROR_CONFIG: IRetryStrategyOptions = {
    rejectShortAttempts: 5,
    rejectShortTimeout: 1000,
    rejectLongTimeout: 10000,
    excludedStatusCodes: [],
};

const DEFAULT_UPDATE_CONFIG: IRepeatStrategyOptions = {
    updateTimeout: 10000,
};

export const genericRetryStrategy = <T extends Response = any>(config = DEFAULT_ERROR_CONFIG) => (req: Observable<T>) => {
    return req.pipe(
        switchMap((error, i) => {
            const retryAttempt = i + 1;
            if (config.excludedStatusCodes
                && config.excludedStatusCodes.find(e => e === error.status)) {
                return throwError(error);
            }

            const attemptNum = config?.rejectShortAttempts || 5;
            const count = (i % (attemptNum)) + 1;
            const timeout = count === config.rejectShortAttempts ? config.rejectLongTimeout : config.rejectShortTimeout;

            console.log(`Attempt ${retryAttempt}: retrying in ${timeout}ms`);

            if (!!config.onRetry) {
                config.onRetry(error);
            }
            return timer(timeout);
        }),
        finalize(() => {
            console.log('Request done!')
        }),
    );
};

export const genericRepeatStrategy = <T = Response>(config = DEFAULT_UPDATE_CONFIG) => (req: Observable<T>) => {
    return req.pipe(
        switchMap((data, i) => {

            console.log(`Update retrying in ${config.updateTimeout}ms`);

            if (!!config.onRepeat) {
                config.onRepeat(data);
            }
            return timer(config.updateTimeout);
        }),
        finalize(() => {
            console.log('Request done!')
        }),
    );
};

export const attemptingRequest = <T = any>(observable: Observable<T>, retryConf: IRetryStrategyOptions, repeatConf: IRepeatStrategyOptions): Observable<T> => {
    return observable
        .pipe(
            map(v => v),
            retryWhen(genericRetryStrategy(retryConf)),
            repeatWhen(genericRepeatStrategy(repeatConf)),
        );
}