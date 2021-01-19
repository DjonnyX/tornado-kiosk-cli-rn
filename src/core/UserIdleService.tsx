import React, { Dispatch, PureComponent } from "react";
import { GestureResponderEvent, View } from "react-native";
import { connect } from "react-redux";
import { config } from "../Config";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { AlertContent, ModalTransparent } from "../components/simple";
import { MyOrderActions } from "../store/actions";

interface IUserIdleServiceProps {
    // store
    _onReset?: () => void;
    _currentScreen?: MainNavigationScreenTypes | undefined;

    // self
    onIdle?: () => void;
    children: Array<JSX.Element> | JSX.Element;
}

interface IUserIdleServiceState {
    alertVisible: boolean;
    countdown: number;
}

class UserIdleServiceContainer extends PureComponent<IUserIdleServiceProps, IUserIdleServiceState> {

    private _timer: NodeJS.Timeout | undefined;

    private _countdownTimer: NodeJS.Timeout | undefined;

    private _touchProcessHandler = (e: GestureResponderEvent): void => {
        this.resetTimer();
    }

    private _onIdle = () => {
        switch (this.props._currentScreen) {
            case MainNavigationScreenTypes.LOADING:
            case MainNavigationScreenTypes.INTRO:
            case MainNavigationScreenTypes.AUTH:
                this.resetTimer();
                break;
            default: {
                if (this.props.onIdle) {
                    this.props.onIdle();
                }

                this.runCountdown();
            }
        }
    }

    private _onCountdown = () => {
        if (this.state.countdown <= 1) {
            this.setState((state) => ({
                ...state,
                alertVisible: false,
            }), () => {
                this.resetCountdownTimer();
                this.resetStore();
            });
            return;
        }

        this.setState((state) => ({
            ...state,
            countdown: state.countdown - 1,
        }));
    }

    constructor(props: IUserIdleServiceProps) {
        super(props);

        this.state = {
            alertVisible: false,
            countdown: 0,
        }
    }

    componentDidMount() {
        this.resetTimer();
    }

    private runCountdown(): void {
        this.stopTimer();

        this.setState((state) => ({
            ...state,
            alertVisible: true,
            countdown: 10,
        }), () => {
            this.runCoutndownTimer();
        });
    }

    private runCoutndownTimer(): void {
        this._countdownTimer = setInterval(this._onCountdown, 1000);
    }

    private resetTimer(): void {
        this.stopTimer();

        this.runTimer();
    }

    private resetCountdownTimer(): void {
        if (this._countdownTimer) {
            clearInterval(this._countdownTimer);
        }
    }

    private stopTimer(): void {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }

    private runTimer(): void {
        this._timer = setTimeout(this._onIdle,
            config.capabilities.userIdleTimeout);
    }

    private cancelResetHandler = () => {
        this.setState((state) => ({
            ...state,
            alertVisible: false,
        }));
        this.resetCountdownTimer();
        this.resetTimer();
    }

    private resetHandler = () => {
        this.setState((state) => ({
            ...state,
            alertVisible: false,
        }));
        this.resetStore();
    }

    private resetStore = () => {
        if (this.props._onReset) {
            this.props._onReset();
        }
    }

    render() {
        const { alertVisible, countdown } = this.state;

        return <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <ModalTransparent visible={alertVisible}>
                <AlertContent
                    title="Внимание"
                    message={`Заказ будет отменен через ${countdown} сек`}
                    cancelButtonTitle="Отменить"
                    applyButtonTitle="Удалить"
                    onCancel={this.cancelResetHandler}
                    onApply={this.resetHandler}
                />
            </ModalTransparent>
            <View style={{ flex: 1, width: "100%", height: "100%" }} onTouchStart={this._touchProcessHandler} onTouchEnd={this._touchProcessHandler}>
                {
                    this.props.children
                }
            </View>
        </View>
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onReset: () => {
            dispatch(MyOrderActions.reset());
        },
    };
};

export const UserIdleService = connect(mapStateToProps, mapDispatchToProps)(UserIdleServiceContainer);