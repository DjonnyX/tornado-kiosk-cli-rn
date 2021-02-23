import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { Picker } from '@react-native-community/picker';
import { View, TextInput } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CombinedDataSelectors, SystemSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";
import { theme } from "../../theme";
import { NotificationActions } from "../../store/actions";
import { refApiService } from "../../services";
import { take } from "rxjs/operators";
import { SystemActions } from "../../store/actions/SystemAction";
import { SimpleButton } from "../simple";
import { IStore } from "@djonnyx/tornado-types";
import { IAlertState } from "../../interfaces";

interface IAuthSelfProps {
    // store props
    _onChangeSerialNumber: (serialNumber: string) => void;
    _onChangeSetupStep: (setupStep: number) => void;
    _onChangeTerminalId: (terminalId: string) => void;
    _alertOpen: (alert: IAlertState) => void;
    _progress: number;
    _serialNumber: string;
    _setupStep: number;
    _terminalId: string;
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self props
}

interface IAuthProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, IAuthSelfProps { }

const AuthScreenContainer = React.memo(({ _serialNumber, _setupStep, _terminalId, navigation,
    _alertOpen, _onChangeSerialNumber, _onChangeSetupStep, _onChangeTerminalId,
}: IAuthProps) => {
    const [stores, setStores] = useState<Array<IStore>>([]);
    const [serialNumber, setSerialNumber] = useState<string>(_serialNumber);
    const [terminalName, setTerminalName] = useState<string>("");
    const [storeId, setStoreId] = useState<string>("");
    const [isLicenseValid, setLicenseValid] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [retryVerificationId, setRetryVerificationId] = useState<number>(0);
    const [retryGetStores, setRetryGetStores] = useState<number>(0);

    useEffect(() => {
        if (_setupStep === 2) {
            if (!!_serialNumber) {
                setShowProgressBar(true);

                refApiService.terminalLicenseVerify(_serialNumber).pipe(
                    take(1),
                ).subscribe(
                    l => {
                        setLicenseValid(true);

                        setShowProgressBar(false);

                        refApiService.serial = _serialNumber;

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
                        _alertOpen({
                            title: "Ошибка", message: err.message ? err.message : err, buttons: [
                                {
                                    title: "Повторить",
                                    action: () => {
                                        retryVerificationHandler();
                                    }
                                }
                            ]
                        });

                        // License invalid
                        setShowProgressBar(false);
                        setLicenseValid(false);
                    },
                );
            } else {
                setLicenseValid(false);
            }
        }
    }, [_serialNumber, _setupStep, retryVerificationId]);

    useEffect(() => {
        if (_setupStep === 1) {
            refApiService.getStores({
                serial: serialNumber,
            }).subscribe(
                v => {
                    setStores(v);
                },
                err => {
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Повторить",
                                action: () => {
                                    retryGetStoresHandler();
                                }
                            }
                        ]
                    });
                }
            );
        }
    }, [_setupStep, retryGetStores]);

    const retryGetStoresHandler = () => {
        setRetryGetStores(() => retryGetStores + 1);
    };

    const retryVerificationHandler = () => {
        setRetryVerificationId(() => retryVerificationId + 1);
    };

    const changeSerialNumHandler = (val: string) => {
        setSerialNumber(val);
    };

    const changeTerminalNameHandler = (val: string) => {
        setTerminalName(val);
    }

    const authHandler = useCallback(() => {
        setShowProgressBar(true);
        refApiService.terminalRegistration(serialNumber).pipe(
            take(1),
        ).subscribe(
            t => {
                _onChangeTerminalId(t.id || "");

                _onChangeSetupStep(1);

                _onChangeSerialNumber(serialNumber);
                setShowProgressBar(false);
            },
            err => {
                _alertOpen({
                    title: "Ошибка", message: err.message ? err.message : err, buttons: [
                        {
                            title: "Закрыть",
                        }
                    ]
                });
                setShowProgressBar(false);
            }
        );
    }, [serialNumber]);

    const saveParamsHandler = useCallback(() => {
        if (!_terminalId) {
            return;
        }

        setShowProgressBar(true);
        refApiService.terminalSetParams(_terminalId, { name: terminalName, storeId }).pipe(
            take(1),
        ).subscribe(
            t => {
                setShowProgressBar(false);

                _onChangeTerminalId(_terminalId);

                _onChangeSetupStep(2);
            },
            err => {
                _alertOpen({
                    title: "Ошибка", message: err.message ? err.message : err, buttons: [
                        {
                            title: "Закрыть",
                        }
                    ]
                });
                setShowProgressBar(false);
            }
        );
    }, [terminalName, storeId, _terminalId]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
            {
                !isLicenseValid &&
                <>
                    {
                        // Enter serial number
                        _setupStep === 0 &&
                        <>
                            <TextInput placeholderTextColor="#fff7009c" selectionColor="#fff700" underlineColorAndroid="#fff700"
                                style={{ textAlign: "center", color: "#ffffff", minWidth: 140, marginBottom: 12 }} editable={!showProgressBar}
                                placeholder="Серийный ключ" onChangeText={changeSerialNumHandler} value={serialNumber}></TextInput>
                            <SimpleButton style={{ backgroundColor: "#fff700", minWidth: 140 }} textStyle={{ color: "#000000" }}
                                onPress={authHandler} title="Зарегистрировать" disabled={showProgressBar}></SimpleButton>
                        </>
                    }
                    {
                        // Enter terminal name and store
                        _setupStep === 1 &&
                        <>
                            <TextInput placeholderTextColor="#fff7009c" selectionColor="#fff700" underlineColorAndroid="#fff700"
                                style={{ textAlign: "center", color: "#ffffff", minWidth: 140, marginBottom: 12 }} editable={!showProgressBar}
                                placeholder="Имя терминала" onChangeText={changeTerminalNameHandler} value={terminalName}></TextInput>
                            <Picker
                                selectedValue={storeId}
                                style={{ textAlign: "center", minWidth: 140, color: "#fff7009c", borderWidth: 2, borderColor: "#fff7009c", borderRadius: 4 }}
                                onValueChange={(itemValue, itemIndex) => setStoreId(String(itemValue))}
                            >
                                {
                                    stores.map(store => <Picker.Item label={store.name} value={store.id || ""} />)

                                }
                            </Picker>
                            <SimpleButton style={{ backgroundColor: "#fff700", minWidth: 140 }} textStyle={{ color: "#000000" }}
                                onPress={saveParamsHandler} title="Сохранить" disabled={showProgressBar}></SimpleButton>
                        </>
                    }
                </>
            }
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
        _setupStep: SystemSelectors.selectSetupStep(state),
        _terminalId: SystemSelectors.selectTerminalId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeSerialNumber: (serialNumber: string) => {
            dispatch(SystemActions.setSerialNumber(serialNumber));
        },
        _onChangeSetupStep: (setupStep: number) => {
            dispatch(SystemActions.setSetupStep(setupStep));
        },
        _onChangeTerminalId: (terminalId: string) => {
            dispatch(SystemActions.setTerminalId(terminalId));
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const AuthScreen = connect(mapStateToProps, mapDispatchToProps)(AuthScreenContainer);