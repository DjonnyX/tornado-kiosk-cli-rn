import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { Picker } from '@react-native-community/picker';
import { View, TextInput } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CapabilitiesSelectors, CombinedDataSelectors, SystemSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";
import { theme } from "../../theme";
import { CapabilitiesActions, NotificationActions } from "../../store/actions";
import { assetsService, refApiService } from "../../services";
import { map, switchMap, take } from "rxjs/operators";
import { SystemActions } from "../../store/actions/SystemAction";
import { SimpleButton } from "../simple";
import { ExternalStorage } from "../../native";
import { from, of } from "rxjs";
import { IStore, ITerminal } from "@djonnyx/tornado-types";

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

const getStorageAssetsPath = async (): Promise<string> => {
    let userDataPath: string | undefined = undefined;

    const isStorageAvailable = await ExternalStorage.isStorageAvailable();
    const isStorageWritable = await ExternalStorage.isStorageWritable();

    if (isStorageAvailable && !isStorageWritable) {
        userDataPath = await ExternalStorage.getPath();
    }

    return `${userDataPath}/assets`;
}

const mkdir = async (path: string): Promise<void> => {
    try {
        if (!await assetsService.exists(path)) {
            await assetsService.mkdir(path);
        }
    } catch (err) {
        console.warn(err, path);
    }
}

function createAssetsClientDir<T extends { clientId: string }>(v: T) {
    return of(v).pipe(
        switchMap(_ => {
            return from(getStorageAssetsPath()).pipe(
                switchMap(path => {
                    return from(mkdir(`${path}/${v.clientId}`)).pipe(
                        map(_ => v),
                    )
                })
            )
        }),
    );
}

interface IAuthProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, IAuthSelfProps { }

const AuthScreenContainer = React.memo(({ _serialNumber, navigation, _currentScreen,
    _alertOpen, _onChangeScreen, _onChangeSerialNumber,
}: IAuthProps) => {
    const [step, setStep] = useState<number>(0);
    const [terminal, setTerminal] = useState<ITerminal | null>(null);
    const [stores, setStores] = useState<Array<IStore>>([]);
    const [serialNumber, setSerialNumber] = useState<string>(_serialNumber);
    const [terminalName, setTerminalName] = useState<string>("");
    const [storeId, setStoreId] = useState<string>("");
    const [isLicenseValid, setLicenseValid] = useState<boolean>(true);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

    useEffect(() => {
        _onChangeScreen();
    }, [_currentScreen]);

    useEffect(() => {
        if (step === 0) {
            if (!!_serialNumber) {
                setShowProgressBar(true);
                refApiService.terminalLicenseVerify(_serialNumber).pipe(
                    take(1),
                    switchMap(l => createAssetsClientDir(l)),
                ).subscribe(
                    l => {
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
                        console.warn(err)
                        // License invalid
                        setShowProgressBar(false);
                        setLicenseValid(false);
                    },
                );
            } else {
                setLicenseValid(false);
            }
        }
    }, [_serialNumber, step]);

    useEffect(() => {
        if (step === 1) {
            refApiService.getStores({
                serial: serialNumber,
            }).subscribe(
                v => {
                    setStores(v);
                }
            );
        }
    }, [step]);

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
            switchMap(l => createAssetsClientDir(l)),
        ).subscribe(
            t => {
                setTerminal(t);

                setStep(1);

                _onChangeSerialNumber(serialNumber);
                setShowProgressBar(false);

                refApiService.serial = serialNumber;
            },
            err => {
                _alertOpen({ title: "Ошибка", message: err.message ? err.message : err });
                setShowProgressBar(false);
            }
        );
    }, [serialNumber]);

    const saveParamsHandler = useCallback(() => {
        if (!terminal?.id) {
            return;
        }

        setShowProgressBar(true);
        refApiService.terminalSetParams(terminal?.id, { name: terminalName, storeId }).pipe(
            take(1),
        ).subscribe(
            t => {
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
    }, [terminalName, storeId]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
            {
                !isLicenseValid &&
                <>
                    {
                        // Enter serial number
                        step === 0 &&
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
                        step === 1 &&
                        <>
                            <TextInput placeholderTextColor="#fff7009c" selectionColor="#fff700" underlineColorAndroid="#fff700"
                                style={{ textAlign: "center", color: "#ffffff", minWidth: 140, marginBottom: 12 }} editable={!showProgressBar}
                                placeholder="Имя терминала" onChangeText={changeTerminalNameHandler} value={terminalName}></TextInput>
                            <Picker
                                selectedValue={storeId}
                                style={{ height: 50, minWidth: 140 }}
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