import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { ICompiledLanguage, ICompiledOrderType, ICurrency, ITerminalKioskConfig } from "@djonnyx/tornado-types";
import { OrderWizard } from "./order/OrderWizard";
import { OrderWizardEventTypes } from "./order/events";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors, SystemSelectors } from "../store/selectors";
import { IAlertState, ISnackState } from "../interfaces";
import { IOrderWizard, IPositionWizard } from "./interfaces";
import { orderApiService } from "../services";
import { Subject } from "rxjs";
import { finalize, take, takeUntil } from "rxjs/operators";
import { MainNavigationScreenTypes } from "../components/navigation";
import { localize } from "../utils/localization";

interface IOrderServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;
    _alertOpen: (alert: IAlertState) => void;
    _setCurrentScreen: (screen: MainNavigationScreenTypes) => void;
    _setIsOrderProcessing: (value: boolean) => void;
    _onSetOrderWizard: (orderWizard: IOrderWizard | undefined) => void;

    _orderWizard?: IOrderWizard | undefined;
    _config?: ITerminalKioskConfig;
    _orderStateId?: number;
    _storeId?: string;
    _orderType?: ICompiledOrderType,
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _isOrderProcessing?: boolean;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
    onCreate?: (orderWizard: IOrderWizard | undefined) => void;
}

export const OrderServiceContainer = React.memo(({ _orderStateId, _storeId, _config, _language, _currency,
    _orderType, _isOrderProcessing, _orderWizard, _onSetOrderWizard,
    _setCurrentScreen, _snackOpen, _alertOpen, _onUpdateStateId, _setIsOrderProcessing, onNavigate, onCreate }: IOrderServiceProps) => {
    const [previousLastPosition, setPreviousLastPosition] = useState<IPositionWizard | null>(null);

    useEffect(() => {
        if (!!_orderWizard) {
            const onOrderWizardChange = () => {
                _onUpdateStateId(_orderWizard?.stateId || 0);
            }

            _orderWizard.addListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            return () => {
                _orderWizard.removeListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            }
        }
    }, [_orderWizard]);

    useEffect(() => {
        const unsubscribe$ = new Subject<void>();

        if (_isOrderProcessing) {
            _setCurrentScreen(MainNavigationScreenTypes.PAY_STATUS);

            if (!!_orderWizard) {
                const orderData = _orderWizard?.toOrderData();
                orderApiService.sendOrder(orderData).pipe(
                    take(1),
                    takeUntil(unsubscribe$),
                    finalize(() => {
                        _setIsOrderProcessing(false);
                    })
                ).subscribe(
                    order => {
                        if (!!_orderWizard) {
                            _orderWizard.result = order;
                        }

                        _setCurrentScreen(MainNavigationScreenTypes.PAY_CONFIRMATION);
                    },
                    err => {
                        _setCurrentScreen(MainNavigationScreenTypes.CONFIRMATION_ORDER);
                        _alertOpen({
                            title: "Ошибка", message: err.message ? err.message : err, buttons: [
                                {
                                    title: "Отмена",
                                    action: () => { }
                                },
                                {
                                    title: "Повторить",
                                    action: () => {
                                        _setIsOrderProcessing(true);
                                    }
                                }
                            ]
                        });
                    }
                );
            }
        }

        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };
    }, [_isOrderProcessing]);

    useEffect(() => {
        if (!!_storeId && !!_config && !!_language && !!_currency && !!_orderType) {
            if (!_orderWizard) {
                const ow = new OrderWizard(_storeId, _config.suffix, _currency, _language, _orderType);
                _onSetOrderWizard(ow);
            } else {
                _orderWizard.orderType = _orderType;
                _orderWizard.suffix = _config.suffix;
                _orderWizard.currency = _currency;
                _orderWizard.language = _language;
            }
        }
    }, [_storeId, _config, _language, _orderType, _currency, _orderWizard]);

    useEffect(() => {
        if (!!_orderWizard?.lastPosition && previousLastPosition !== _orderWizard.lastPosition) {
            setPreviousLastPosition(_orderWizard.lastPosition);
        }
    }, [_orderStateId, _orderWizard]);

    useEffect(() => {
        if (!!previousLastPosition) {
            _snackOpen({
                message: localize(_language as ICompiledLanguage, "kiosk_add_product_message",
                    String(previousLastPosition?.__product__?.contents[_language?.code || ""]?.name)),
                duration: 5000,
            });
        }
    }, [previousLastPosition]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _storeId: SystemSelectors.selectStoreId(state),
        _config: CombinedDataSelectors.selectConfig(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _orderType: CapabilitiesSelectors.selectOrderType(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _isOrderProcessing: MyOrderSelectors.selectIsProcessing(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onSetOrderWizard: (orderWizard: IOrderWizard | undefined) => {
            dispatch(MyOrderActions.setWizard(orderWizard));
        },
        _onUpdateStateId: (stateId: number) => {
            dispatch(MyOrderActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
        _setCurrentScreen: (screen: MainNavigationScreenTypes) => {
            dispatch(CapabilitiesActions.setCurrentScreen(screen));
        },
        _setIsOrderProcessing: (value: boolean) => {
            dispatch(MyOrderActions.isProcessing(value));
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const OrderService = connect(mapStateToProps, mapDispatchToProps)(OrderServiceContainer);