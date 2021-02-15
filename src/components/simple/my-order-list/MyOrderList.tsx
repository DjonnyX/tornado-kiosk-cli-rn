import React, { useRef, useCallback, Dispatch } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";
import { MyOrderListItem } from "./MyOrderListItem";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../../../store/selectors";
import { IAppState } from "../../../store/state";
import { connect } from "react-redux";
import { OrderWizard } from "../../../core/order/OrderWizard";

interface IMyOrderListProps {
    // store
    _currency?: ICurrency;
    _language?: ICompiledLanguage;
    _orderStateId?: number;
}

export const MyOrderListContainer = React.memo(({ _currency, _language, _orderStateId }: IMyOrderListProps) => {
    const scrollView = useRef<ScrollView>(null);

    const contentSizeChangeHandler = useCallback(() => {
        scrollView.current?.scrollToEnd({ animated: true });
    }, [scrollView]);

    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView ref={scrollView} onContentSizeChange={contentSizeChangeHandler} style={{ flex: 1 }} horizontal={false}
            >
                <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={OrderWizard.current.positions} renderItem={({ item }) => {
                    return <MyOrderListItem key={item.id} position={item} currency={_currency as ICurrency}
                        language={_language as ICompiledLanguage} imageHeight={48} stateId={item.stateId}/>
                }}
                    keyExtractor={(item, index) => index.toString()}>
                </FlatList>
            </ScrollView>
        </SafeAreaView>
    )
})

const mapStateToProps = (state: IAppState, ownProps: IMyOrderListProps) => {
    return {
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const MyOrderList = connect(mapStateToProps, mapDispatchToProps)(MyOrderListContainer);