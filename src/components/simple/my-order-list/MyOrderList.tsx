import React, { useRef, useCallback, Dispatch } from "react";
import { SafeAreaView } from "react-native";
import { ICompiledLanguage, ICurrency, IKioskTheme, IKioskThemeData } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";
import { MyOrderListItem } from "./MyOrderListItem";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors, MyOrderSelectors } from "../../../store/selectors";
import { IAppState } from "../../../store/state";
import { connect } from "react-redux";
import { IAlertState } from "../../../interfaces";
import { NotificationActions } from "../../../store/actions";
import { IOrderWizard, IPositionWizard } from "../../../core/interfaces";

interface IMyOrderListProps {
    // store
    _theme?: IKioskTheme;
    _currency?: ICurrency;
    _language?: ICompiledLanguage;
    _orderStateId?: number;
    _menuStateId?: number;
    _orderWizard?: IOrderWizard;
    _alertOpen?: (alert: IAlertState) => void;
}

export const MyOrderListContainer = React.memo(({ _theme, _currency, _language, _alertOpen, _orderStateId, _menuStateId, _orderWizard }: IMyOrderListProps) => {
    const flatListRef = useRef<FlatList<IPositionWizard>>();

    const contentSizeChangeHandler = useCallback(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [flatListRef]);

    const theme = _theme?.themes?.[_theme?.name] as IKioskThemeData;

    return (
        <>
            {
                !!theme &&
                <SafeAreaView style={{
                    flex: 1, width: "100%",
                }}>
                    <FlatList ref={flatListRef as any} onContentSizeChange={contentSizeChangeHandler} persistentScrollbar
                        updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={_orderWizard?.positions || []} renderItem={({ item }) => {
                            return <MyOrderListItem theme={theme} key={item.id} orderWizard={_orderWizard} position={item} currency={_currency as ICurrency}
                                language={_language as ICompiledLanguage} imageHeight={48} stateId={item.stateId} menuStateId={_menuStateId as number}
                                alertOpen={_alertOpen as any} />
                        }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                </SafeAreaView>
            }
        </>
    )
})

const mapStateToProps = (state: IAppState, ownProps: IMyOrderListProps) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _theme: CapabilitiesSelectors.selectTheme(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const MyOrderList = connect(mapStateToProps, mapDispatchToProps)(MyOrderListContainer);