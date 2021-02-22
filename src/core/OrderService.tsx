import React, { Component, Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { IBusinessPeriod, ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import { OrderWizard } from "./order/OrderWizard";
import { OrderWizardEventTypes } from "./order/events";
import { MyOrderActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../store/selectors";
import { ISnackState } from "../interfaces";
import { IOrderWizard, IPositionWizard } from "./interfaces";

interface IOrderServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;

    _orderStateId?: number;
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _businessPeriods?: Array<IBusinessPeriod>;
}

export const OrderServiceContainer = React.memo(({ _orderStateId, _language,
    _currency, _businessPeriods, _snackOpen, _onUpdateStateId }: IOrderServiceProps) => {
    const [orderWizard, setOrderWizard] = useState<IOrderWizard | undefined>(undefined);
    const [previousLastPosition, setPreviousLastPosition] = useState<IPositionWizard | null>(null);

    useEffect(() => {
        if (orderWizard) {
            const onOrderWizardChange = () => {
                setTimeout(() => {
                    _onUpdateStateId(orderWizard?.stateId || 0);
                });
            }

            orderWizard.addListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            return () => {
                orderWizard.removeListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            }
        }
    }, [orderWizard]);

    useEffect(() => {
        if (!!_language && !!_currency && !!_businessPeriods) {

            if (!orderWizard) {
                const ow = new OrderWizard(_currency, _businessPeriods, _language);
                setOrderWizard(ow);

            } else {
                orderWizard.currency = _currency;
                orderWizard.language = _language;
                orderWizard.businessPeriods = _businessPeriods;
            }
        }
    }, [_language, _currency, _businessPeriods]);

    useEffect(() => {
        if (!!OrderWizard?.current?.lastPosition && previousLastPosition !== OrderWizard.current.lastPosition) {
            setPreviousLastPosition(OrderWizard.current.lastPosition);
        }
    }, [_orderStateId]);

    useEffect(() => {
        if (!!previousLastPosition) {
            _snackOpen({
                message: `"${previousLastPosition?.__product__?.contents[_language?.code || ""]?.name}" добавлен в заказ!`,
                duration: 5000,
            });
        }
    }, [previousLastPosition]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _businessPeriods: CombinedDataSelectors.selectBusinessPeriods(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onUpdateStateId: (stateId: number) => {
            dispatch(MyOrderActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
    };
};

export const OrderService = connect(mapStateToProps, mapDispatchToProps)(OrderServiceContainer);