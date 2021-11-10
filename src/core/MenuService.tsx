import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import { MenuWizard } from "./menu/MenuWizard";
import { MenuWizardEventTypes } from "./menu/events";
import { MenuActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors, MyOrderSelectors } from "../store/selectors";
import { ISnackState } from "../interfaces";
import { MainNavigationScreenTypes } from "../components/navigation";
import { localize } from "../utils/localization";
import { IOrderWizard } from "./interfaces";

interface IMenuServiceProps {
    // store
    _onSetWizard: (wizard: MenuWizard) => void;
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;

    _menuWizard: MenuWizard | undefined;
    _orderWizard: IOrderWizard | undefined;
    _menuStateId?: number;
    _menu?: ICompiledMenu;
    _currency?: ICurrency;
    _businessPeriods?: Array<IBusinessPeriod>;
    _orderTypes?: Array<ICompiledOrderType>;

    _language?: ICompiledLanguage;
    _currentOrderType?: ICompiledOrderType;
    _currentScreen: MainNavigationScreenTypes;
}

export const MenuServiceContainer = React.memo(({ _menuStateId, _menu, _language, _currentOrderType, _menuWizard,
    _currency, _businessPeriods, _orderTypes, _currentScreen, _orderWizard, _snackOpen, _onUpdateStateId, _onSetWizard }: IMenuServiceProps) => {
    useEffect(() => {
        if (!!_menuWizard) {
            const onMenuWizardChange = () => {
                if (!!_orderWizard) {
                    _orderWizard?.fireChangeMenu();
                }

                _onUpdateStateId(_menuWizard?.stateId || 0);
            }

            _menuWizard.addListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            return () => {
                _menuWizard.removeListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            }
        }
    }, [_menuWizard, _orderWizard]);

    useEffect(() => {
        if (!!_language && !!_currency && !!_businessPeriods && !!_orderTypes && !!_menu) {

            const orderType = _currentOrderType || (_orderTypes.length > 0 ? _orderTypes[0] : {} as any);

            if (!_menuWizard) {
                const mw = new MenuWizard(_currency,
                    _businessPeriods,
                    orderType,
                    _language,
                );

                mw.rawMenu = _menu as ICompiledMenu;
                mw.orderType = orderType;
                _onSetWizard(mw);

            } else {
                _menuWizard.rawMenu = _menu as ICompiledMenu;
                _menuWizard.currency = _currency;
                _menuWizard.language = _language;
                _menuWizard.businessPeriods = _businessPeriods;
                _menuWizard.orderType = orderType;
            }
        }
    }, [_language, _currency, _businessPeriods, _orderTypes, _currentOrderType, _menu]);

    useEffect(() => {
        if (Number(_menuStateId) > 0 && (_currentScreen === MainNavigationScreenTypes.MENU || _currentScreen === MainNavigationScreenTypes.CONFIRMATION_ORDER)
            && !!_orderWizard) {
            _snackOpen({
                message: localize(_language as ICompiledLanguage, "kiosk_menu_change_message"),
                duration: 5000,
            });
        }
    }, [_menuStateId]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _menuWizard: MenuSelectors.selectWizard(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _businessPeriods: CombinedDataSelectors.selectBusinessPeriods(state),
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _menuStateId: MenuSelectors.selectStateId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
        _currentOrderType: CapabilitiesSelectors.selectOrderType(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onSetWizard: (wizard: MenuWizard) => {
            dispatch(MenuActions.setWizard(wizard));
        },
        _onUpdateStateId: (stateId: number) => {
            dispatch(MenuActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
    };
};

export const MenuService = connect(mapStateToProps, mapDispatchToProps)(MenuServiceContainer as any);