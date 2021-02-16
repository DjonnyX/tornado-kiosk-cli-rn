import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors, MyOrderSelectors } from "../store/selectors";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainNavigationScreenTypes } from "../components/navigation";
import { CommonActions } from "@react-navigation/native";
import { NotificationActions } from "../store/actions";

interface INavigationServiceProps {
    // store
    _snackClose: () => void;
    _alertClose: () => void;

    _orderStateId: number;
    _currentScreen: MainNavigationScreenTypes;
    _navigator: StackNavigationProp<any, MainNavigationScreenTypes>;
}

interface INavigationServiceState { }

class NavigationServiceContainer extends Component<INavigationServiceProps, INavigationServiceState> {
    constructor(props: any) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<INavigationServiceProps>, nextState: Readonly<INavigationServiceState>, nextContext: any) {
        if (nextProps._navigator && this.props._orderStateId !== nextProps._orderStateId) {
            if (nextProps._orderStateId === 0 && (nextProps._currentScreen === MainNavigationScreenTypes.MENU
                || nextProps._currentScreen === MainNavigationScreenTypes.CONFIRMATION_ORDER)) {
                setTimeout(() => {
                    nextProps._navigator.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: MainNavigationScreenTypes.INTRO },
                            ],
                        })
                    );

                    this.props._alertClose();
                    this.props._snackClose();
                });
            } else
                if (nextProps._orderStateId === 1 && nextProps._currentScreen !== MainNavigationScreenTypes.MENU) {
                    nextProps._navigator.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: MainNavigationScreenTypes.MENU },
                            ],
                        })
                    );
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
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _navigator: CapabilitiesSelectors.selectNavigator(state),
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