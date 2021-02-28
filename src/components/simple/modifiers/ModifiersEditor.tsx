import { ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { FlatList } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { PositionWizardModes } from "../../../core/enums";
import { IPositionWizard } from "../../../core/interfaces";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { PositionWizardEventTypes } from "../../../core/position-wizard/events";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../../../store/selectors";
import { IAppState } from "../../../store/state";
import { Icons, theme } from "../../../theme";
import { ModalRollTop } from "../ModalRollTop";
import { SimpleButton } from "../SimpleButton";
import { ModifierListItem } from "./ModifierListItem";

interface IModifiersEditorProps {
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _orderStateId?: number;
}

export const ModifiersEditorContainer = React.memo(({ _orderStateId, _language, _currency }: IModifiersEditorProps) => {
    const [stateId, setStateId] = useState<number>(-1);
    const [position, setPosition] = useState<IPositionWizard | null>(OrderWizard.current.currentPosition);

    useEffect(() => {
        setStateId(_orderStateId || 0);
        setPosition(OrderWizard.current?.currentPosition);
    }, [_orderStateId]);

    useEffect(() => {
        const changeProductHandler = () => {
            setStateId(position?.stateId || 0);
        };

        if (position?.mode === PositionWizardModes.NEW) {
            position.addListener(PositionWizardEventTypes.CHANGE, changeProductHandler);
        }
        return () => {
            if (!!position) {
                position.addListener(PositionWizardEventTypes.CHANGE, changeProductHandler);
            }
        }
    }, [position]);

    const onPreviousGroup = useCallback(() => {
        if (!!OrderWizard.current) {
            OrderWizard.current.gotoPreviousGroup();
        }
    }, []);

    const onNextGroup = useCallback(() => {
        if (!!OrderWizard.current) {
            OrderWizard.current.gotoNextGroup();
        }
    }, []);

    const onClose = useCallback(() => {
        if (!!OrderWizard.current) {
            OrderWizard.current.editCancel();
        }
    }, []);

    return (
        <ModalRollTop visible={!!position}>
            <View style={{ flex: 1, width: "100%", padding: 34 }}>
                {
                    !!position && !!_language && !!_currency &&
                    <View style={{ flex: 1, width: "100%" }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <View style={{ flex: 1, width: "100%", flexDirection: "row", marginRight: 48 }}>
                                <View style={{ marginBottom: 5 }} renderToHardwareTextureAndroid={true}>
                                    <FastImage style={{ width: 192, height: 192 }} source={{
                                        uri: `file://${position.__product__?.contents[_language?.code]?.resources?.icon.path}`,
                                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                                </View>
                                <View style={{ flex: 1, marginRight: 30 }}>
                                    <Text style={{
                                        fontSize: 32, fontWeight: "bold", color: theme.themes[theme.name].modifiers.nameColor,
                                        textTransform: "uppercase"
                                    }}>{
                                            position.__product__?.contents[_language.code]?.name
                                        }</Text>
                                    <Text style={{
                                        fontSize: 14, color: theme.themes[theme.name].modifiers.descriptionColor,
                                        textTransform: "uppercase"
                                    }}>{
                                            position.__product__?.contents[_language.code]?.description
                                        }</Text>
                                </View>
                                <View style={{ marginTop: -10 }}>
                                    <Text style={{
                                        fontSize: 48, fontWeight: "bold",
                                        color: theme.themes[theme.name].modifiers.price.textColor,
                                        textTransform: "uppercase",
                                    }}>{
                                            position.getFormatedSumPerOne(true)
                                        }</Text>
                                </View>
                            </View>
                            <View>
                                <CloseButton onPress={onClose}></CloseButton>
                            </View>
                        </View>
                        <View style={{
                            flex: 1, width: "100%", backgroundColor: theme.themes[theme.name].modifiers.backgroundColor,
                            borderTopLeftRadius: 8, borderTopRightRadius: 8
                        }}>
                            <View style={{ width: "100%", alignItems: "center", marginBottom: 8 }}>
                                <View style={{ width: "100%", flexDirection: "row", height: 4, maxWidth: 300, }}>
                                    {
                                        position.groups.map((gr, i) =>
                                            <View key={gr.index} style={{
                                                flex: 1, marginRight: 3, height: 4,
                                                backgroundColor: i === position?.currentGroup
                                                    ? gr.isValid
                                                        ? theme.themes[theme.name].modifiers.group.indicator.currentValidColor
                                                        : theme.themes[theme.name].modifiers.group.indicator.currentInvalidColor
                                                    : theme.themes[theme.name].modifiers.group.indicator.otherColor
                                            }}></View>
                                        )
                                    }
                                </View>
                            </View>
                            <View style={{ width: "100%", flexDirection: "row" }}>
                                <SimpleButton title="Назад"
                                    styleView={{ opacity: 1 }}
                                    style={{
                                        backgroundColor: theme.themes[theme.name].modifiers.group.buttonPrevious.backgroundColor,
                                        borderColor: theme.themes[theme.name].modifiers.group.buttonPrevious.borderColor,
                                        borderRadius: 8, padding: 20
                                    }}
                                    styleDisabled={{
                                        backgroundColor: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledBackgroundColor,
                                        borderRadius: 8, borderWidth: 2,
                                        borderColor: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledBorderColor,
                                    }}
                                    textStyle={{
                                        fontWeight: "bold",
                                        color: theme.themes[theme.name].modifiers.group.buttonPrevious.textColor,
                                        fontSize: 26
                                    }}
                                    textStyleDisabled={{
                                        fontWeight: "bold",
                                        color: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledTextColor,
                                        fontSize: 26
                                    }}
                                    disabled={position.currentGroup === 0} onPress={onPreviousGroup}></SimpleButton>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 24, fontWeight: "bold", color: theme.themes[theme.name].modifiers.group.nameColor,
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        marginBottom: 6,
                                    }}>{
                                            position.groups[position.currentGroup].__node__.__rawNode__.content?.contents[_language.code]?.name
                                        }</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        color: position.groups[position.currentGroup].isValid
                                            ? theme.themes[theme.name].modifiers.group.descriptionColor
                                            : theme.themes[theme.name].modifiers.group.descriptionInvalidColor,
                                        textAlign: "center", textTransform: "uppercase",
                                    }}>{
                                            position.groups[position.currentGroup].__node__.__rawNode__.content?.contents[_language.code]?.description
                                        }</Text>
                                </View>
                                <SimpleButton title={position.currentGroup === position.groups.length - 1 ? "Готово" : "Далее"}
                                    styleView={{ opacity: 1 }}
                                    style={{
                                        backgroundColor: theme.themes[theme.name].modifiers.group.buttonPrevious.backgroundColor,
                                        borderColor: theme.themes[theme.name].modifiers.group.buttonPrevious.borderColor,
                                        borderRadius: 8, padding: 20
                                    }}
                                    styleDisabled={{
                                        backgroundColor: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledBackgroundColor,
                                        borderRadius: 8, borderWidth: 2,
                                        borderColor: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledBorderColor,
                                    }}
                                    textStyle={{
                                        fontWeight: "bold",
                                        color: theme.themes[theme.name].modifiers.group.buttonPrevious.textColor,
                                        fontSize: 26
                                    }}
                                    textStyleDisabled={{
                                        fontWeight: "bold",
                                        color: theme.themes[theme.name].modifiers.group.buttonPrevious.disabledTextColor,
                                        fontSize: 26
                                    }}
                                    disabled={!position.groups[position.currentGroup].isValid} onPress={onNextGroup}></SimpleButton>
                            </View>
                            <SafeAreaView style={{
                                flex: 1, width: "100%",
                            }}>
                                <ScrollView style={{ flex: 1, marginTop: 68 }} horizontal={true}>
                                    <FlatList persistentScrollbar horizontal={true}
                                        updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={position.groups[position.currentGroup].positions} renderItem={({ item }) => {
                                            return <ModifierListItem width={256} key={item.id} position={item} currency={_currency} language={_language}
                                                thumbnailHeight={128} stateId={item.stateId} />
                                        }}
                                        keyExtractor={(item, index) => index.toString()}>
                                    </FlatList>
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </View>
                }
            </View>
        </ModalRollTop>
    );
})

interface ICloseButtonProps {
    onPress: () => void;
}

const CloseButton = ({ onPress }: ICloseButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ borderRadius: 16 }}
            >
                <Icons name="Close" fill={theme.themes[theme.name].menu.backButton.iconColor} width={44} height={44} ></Icons>
            </View>
        </TouchableOpacity>
    )
}

const mapStateToProps = (state: IAppState, ownProps: IModifiersEditorProps) => {
    return {
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        /*_onAddOrderPosition: (product: ICompiledProduct) => {
            dispatch(MyOrderActions.addPosition(product));
        },
        _onUpdateOrderPosition: (position: IOrderPosition) => {
            dispatch(MyOrderActions.updatePosition(position));
        },
        _onRemoveOrderPosition: (position: IOrderPosition) => {
            dispatch(MyOrderActions.removePosition(position));
        },*/
    };
};

export const ModifiersEditor = connect(mapStateToProps, mapDispatchToProps)(ModifiersEditorContainer);