import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, TextInput } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CapabilitiesSelectors, CombinedDataSelectors, SystemSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";
import { theme } from "../../theme";
import { CapabilitiesActions, NotificationActions } from "../../store/actions";
import { refApiService } from "../../services";
import { take } from "rxjs/operators";
import { SystemActions } from "../../store/actions/SystemAction";
import { SimpleButton } from "../simple";

interface IAuthSelfProps {
    // store props
    _onChangeScreen: () => void;
    _onChangeSerialNumber: (serialNumber: string) => void;
    _alertOpen: (alert: { title: string, message: string }) => void;
    _progress: number;
    _serialNumber: string;
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self props
}

interface IAuthProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, IAuthSelfProps { }

const AuthScreenContainer = React.memo(({ _serialNumber, navigation, _currentScreen,
    _alertOpen, _onChangeScreen, _onChangeSerialNumber,
}: IAuthProps) => {
    const [serialNumber, setSerialNumber] = useState(_serialNumber);
    const [isLicenseValid, setLicenseValid] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);

    useEffect(() => {
        _onChangeScreen();
    }, [_currentScreen]);
    
    useEffect(() => {
        console.warn('eeserialNumber', serialNumber)
    }, [_serialNumber]);

    useEffect(() => {
        if (!!serialNumber) {

            setShowProgressBar(true);
            refApiService.terminalLicenseVerify(serialNumber).pipe(
                take(1),
            ).subscribe(
                v => {
                    setShowProgressBar(false);

                    // License valid!
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                { name: MainNavigationScreenTypes.LOADING },
                            ],
                        })
                    );
                },
                err => {
                    // License invalid
                    setShowProgressBar(false);
                    setLicenseValid(false);
                },
            );
        } else {
            setLicenseValid(false);
        }
    }, []);

    const changeSerialNumHandler = (val: string) => {
        setSerialNumber(val);
    };

    const authHandler = useCallback(() => {
        setShowProgressBar(true);
        refApiService.terminalRegistration(serialNumber).pipe(
            take(1),
        ).subscribe(
            v => {
                _onChangeSerialNumber(serialNumber);
                setShowProgressBar(false);

                // Goto loading screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: MainNavigationScreenTypes.LOADING },
                        ],
                    })
                );
            },
            err => {
                _alertOpen({ title: "Ошибка", message: err.message ? err.message : err });
                setShowProgressBar(false);
            }
        );
    }, [serialNumber]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
            {
                !isLicenseValid &&
                <>
                    <TextInput placeholderTextColor="#fff7009c" selectionColor="#fff700" underlineColorAndroid="#fff700"
                        style={{ textAlign: "center", color: "#ffffff", minWidth: 140, marginBottom: 12 }} editable={!showProgressBar}
                        placeholder="Серийный ключ" onChangeText={changeSerialNumHandler} value={serialNumber}></TextInput>
                </>
            }
            <SimpleButton style={{ backgroundColor: "#fff700", minWidth: 140 }} textStyle={{ color: "#000000" }}
                onPress={authHandler} title="Зарегистрировать" disabled={showProgressBar}></SimpleButton>
            {
                !!showProgressBar &&
                <ProgressBar
                    style={{ width: "100%", marginTop: 12, maxWidth: 140, marginLeft: "10%", marginRight: "10%" }}
                    styleAttr="Horizontal"
                    indeterminate={true}
                    color={theme.themes[theme.name].loading.progressBar.trackColor}></ProgressBar>
            }
        </View>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IAuthProps) => {
    return {
        _progress: CombinedDataSelectors.selectProgress(state),
        _serialNumber: SystemSelectors.selectSerialNumber(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeScreen: () => {
            dispatch(CapabilitiesActions.setCurrentScreen(MainNavigationScreenTypes.AUTH));
        },
        _onChangeSerialNumber: (serialNumber: string) => {
            dispatch(SystemActions.setSerialNumber(serialNumber));
        },
        _alertOpen: (alert: { title: string, message: string }) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const AuthScreen = connect(mapStateToProps, mapDispatchToProps)(AuthScreenContainer);