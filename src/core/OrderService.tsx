import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import { OrderWizard } from "./order/OrderWizard";
import { OrderWizardEventTypes } from "./order/events";
import { MyOrderActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../store/selectors";
import { ISnackState } from "../interfaces";
import { IPositionWizard } from "./interfaces";

interface IOrderServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;

    _orderStateId?: number;
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
}

interface IOrderServiceState { }

class OrderServiceContainer extends Component<IOrderServiceProps, IOrderServiceState> {
    private _orderWizard: OrderWizard | undefined;
    private _previousLastPosition: IPositionWizard | null = null;

    private _onOrderWizardChange = () => {
        setTimeout(() => {
            this.props._onUpdateStateId(this._orderWizard?.stateId || 0);
        });
    }

    constructor(props: IOrderServiceProps) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<IOrderServiceProps>, nextState: Readonly<IOrderServiceState>, nextContext: any) {
        if (this.props._language !== nextProps._language
            || this.props._currency !== nextProps._currency) {

            if (!!nextProps._language && !!nextProps._currency) {

                if (!this._orderWizard) {
                    this._orderWizard = new OrderWizard(nextProps._currency, nextProps._language);
                    this._orderWizard.addListener(OrderWizardEventTypes.CHANGE, this._onOrderWizardChange);
                } else {
                    if (this.props._currency !== nextProps._currency) {
                        this._orderWizard.currency = nextProps._currency;
                    }
                    if (this.props._language !== nextProps._language) {
                        this._orderWizard.language = nextProps._language;
                    }
                }
            }
        }

        if (this.props._orderStateId !== nextProps._orderStateId) {
            if (this._previousLastPosition !== OrderWizard.current.lastPosition) {
                this._previousLastPosition = OrderWizard.current.lastPosition;
                if (!!this._previousLastPosition) {
                    this.props._snackOpen({
                        message: `"${this._previousLastPosition?.__product__?.contents[this.props._language?.code || ""]?.name}" добавлен в заказ!`,
                        duration: 10000,
                    });
                }
            }
        }

        if (super.shouldComponentUpdate) return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        return true;
    }

    render() {
        return <></>;
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
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