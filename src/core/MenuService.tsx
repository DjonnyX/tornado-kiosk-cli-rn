import React, { Component, Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICurrency } from "@djonnyx/tornado-types";
import { MenuWizard } from "./menu/MenuWizard";
import { MenuWizardEventTypes } from "./menu/events";
import { MenuActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors } from "../store/selectors";
import { ISnackState } from "../interfaces";

interface IMenuServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;

    _menuStateId?: number;
    _menu?: ICompiledMenu;
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _businessPeriods?: Array<IBusinessPeriod>;
}

export const MenuServiceContainer = React.memo(({ _menuStateId, _menu, _language,
    _currency, _businessPeriods, _snackOpen, _onUpdateStateId }: IMenuServiceProps) => {
    const [menuWizard, setMenuWizard] = useState<MenuWizard | undefined>(undefined);

    useEffect(() => {
        if (menuWizard) {
            const onMenuWizardChange = () => {
                setTimeout(() => {
                    _onUpdateStateId(menuWizard?.stateId || 0);
                });
            }

            menuWizard.addListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            return () => {
                menuWizard.removeListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            }
        }
    }, [menuWizard]);

    useEffect(() => {
        if (!!_language && !!_currency && !!_businessPeriods) {

            if (!menuWizard) {
                const mw = new MenuWizard(_currency, _businessPeriods, _language);
                mw.rawMenu = _menu as ICompiledMenu;
                setMenuWizard(mw);

            } else {
                menuWizard.rawMenu = _menu as ICompiledMenu;
                menuWizard.currency = _currency;
                menuWizard.language = _language;
                menuWizard.businessPeriods = _businessPeriods;
            }
        }
    }, [_language, _currency, _businessPeriods]);

    useEffect(() => {
        _snackOpen({
            message: "Изменение в меню! Некоторые позиции в заказе могут стать недоступны.",
            duration: 5000,
        });
    }, [_menuStateId]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _businessPeriods: CombinedDataSelectors.selectBusinessPeriods(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onUpdateStateId: (stateId: number) => {
            dispatch(MenuActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
    };
};

export const MenuService = connect(mapStateToProps, mapDispatchToProps)(MenuServiceContainer);