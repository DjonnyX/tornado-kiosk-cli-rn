import React, { Dispatch, useEffect } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors, MyOrderSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { NotificationActions } from "../store/actions";

interface INavigationServiceProps {
    // store
    _snackClose?: () => void;
    _alertClose?: () => void;
    _orderStateId?: number;
    _currentScreen?: MainNavigationScreenTypes;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
}

export const NavigationServiceContainer = React.memo(({ onNavigate, _orderStateId, _currentScreen,
    _alertClose, _snackClose }: INavigationServiceProps) => {

    useEffect(() => {
        if (_orderStateId === 0 && (_currentScreen === MainNavigationScreenTypes.MENU
            || _currentScreen === MainNavigationScreenTypes.CONFIRMATION_ORDER)) {
            
            if (_alertClose !== undefined) _alertClose();
            if (_snackClose !== undefined) _snackClose();
            if (onNavigate !== undefined) onNavigate(MainNavigationScreenTypes.INTRO);
        }
        else
            if (_orderStateId === 1 && _currentScreen !== MainNavigationScreenTypes.MENU) {
                if (onNavigate !== undefined) onNavigate(MainNavigationScreenTypes.MENU);
            }
    }, [_orderStateId, _currentScreen, onNavigate]);


    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _snackClose: () => {
            dispatch(NotificationActions.snackClose());
        },
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const NavigationService = connect(mapStateToProps, mapDispatchToProps)(NavigationServiceContainer);