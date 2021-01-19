import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text, Button } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CapabilitiesSelectors, CombinedDataSelectors, SystemSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";
import { theme } from "../../theme";
import { CapabilitiesActions, NotificationActions } from "../../store/actions";
import { TextInput } from "react-native-gesture-handler";
import { refApiService } from "../../services";
import { take } from "rxjs/operators";
import { SystemActions } from "../../store/actions/SystemAction";
import { SimpleButton } from "../simple";

interface IAuthSelfProps {
    // store props
    _onChangeScreen: () => void;
    _onChangeSerialNumber: (serialNumber: string) => void;
    _onChangeName: (name: string) => void;
    _onChangeStoreId: (storeId: string) => void;
    _alertOpen: (alert: { title: string, message: string }) => void;
    _progress: number;
    _serialNumber: string;
    _name: string;
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self props
}

interface IAuthProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, IAuthSelfProps { }

const AuthScreenContainer = React.memo(({ _progress, _serialNumber, _name, navigation, _currentScreen,
    _alertOpen, _onChangeScreen, _onChangeSerialNumber, _onChangeName,
}: IAuthProps) => {
    const [serialNumber, setSerialNumber] = useState(_serialNumber);
    const [name, setName] = useState(_name);
    const [isLicenseValid, setLicenseValid] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);

    useEffect(() => {
        _onChangeScreen();
    }, [_currentScreen]);

    useEffect(() => {
        if (serialNumber) {
            console.log(serialNumber)
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

    const changeNameHandler = (val: string) => {
        setName(val);
    };

    const changeSerialNumHandler = (val: string) => {
        setSerialNumber(val);
    };

    const authHandler = () => {
        setShowProgressBar(true);
        refApiService.terminalRegistry(serialNumber, name).pipe(
            take(1),
        ).subscribe(
            v => {
                console.warn("OK");
                _onChangeSerialNumber(serialNumber);
                _onChangeName(name);

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
                _alertOpen({ title: "Ошибка", message: err });
                setShowProgressBar(false);
            }
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
            {
                !isLicenseValid &&
                <>
                    <TextInput style={{ color: "#ffffff", backgroundColor: "#ffffff" }} placeholder="Имя терминала" onChangeText={changeNameHandler} value={name}></TextInput>
                    <TextInput style={{ color: "#ffffff", backgroundColor: "#ffffff" }} placeholder="Серийный ключ" onChangeText={changeSerialNumHandler} value={serialNumber}></TextInput>
                </>
            }
            <SimpleButton style={{ backgroundColor: "#00ff00" }} textStyle={{ color: "#ffffff" }} onPress={authHandler} title="Аторизоваться"></SimpleButton>
            {
                !!showProgressBar &&
                <ProgressBar
                    style={{ width: "100%", maxWidth: 200, marginLeft: "10%", marginRight: "10%" }}
                    styleAttr="Horizontal"
                    indeterminate={true}
                    color={theme.themes[theme.name].loading.progressBar.trackColor}></ProgressBar>
            }
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IAuthProps) => {
    return {
        _progress: CombinedDataSelectors.selectProgress(state),
        _serialNumber: SystemSelectors.selectDeviceInfo(state)?.serialNumber,
        _name: SystemSelectors.selectDeviceInfo(state)?.name,
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeScreen: () => {
            dispatch(CapabilitiesActions.setCurrentScreen(MainNavigationScreenTypes.LOADING));
        },
        _onChangeSerialNumber: (serialNumber: string) => {
            dispatch(SystemActions.setSerialNumber(serialNumber));
        },
        _onChangeName: (name: string) => {
            dispatch(SystemActions.setName(name));
        },
        _alertOpen: (alert: { title: string, message: string }) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const AuthScreen = connect(mapStateToProps, mapDispatchToProps)(AuthScreenContainer);