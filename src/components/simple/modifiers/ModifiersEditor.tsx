import { ICompiledLanguage, ICurrency, IKioskTheme, IKioskThemeData } from "@djonnyx/tornado-types";
import React, { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { config } from "../../../Config";
import { PositionWizardModes } from "../../../core/enums";
import { IOrderWizard, IPositionWizard } from "../../../core/interfaces";
import { PositionWizardEventTypes } from "../../../core/position-wizard/events";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../../../store/selectors";
import { IAppState } from "../../../store/state";
import { Icons } from "../../../theme";
import { localize } from "../../../utils/localization";
import { GridList } from "../../layouts/GridList";
import { ModalRollTop } from "../ModalRollTop";
import { NumericStapper } from "../NumericStapper";
import { SimpleButton } from "../SimpleButton";
import { ModifierListItem } from "./ModifierListItem";

const MODIFIER_ITEM_WIDTH = 218;

interface IBound {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IModifiersEditorProps {
    _theme?: IKioskTheme;
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _orderStateId?: number;
    _orderWizard?: IOrderWizard | undefined;
}

export const ModifiersEditorContainer = React.memo(({ _theme, _orderStateId, _language, _currency, _orderWizard }: IModifiersEditorProps) => {
    const [stateId, setStateId] = useState<number>(-1);
    const [position, setPosition] = useState<IPositionWizard | null>(_orderWizard?.currentPosition || null);
    const _scrollViewRef = useRef<ScrollView>()

    useEffect(() => {
        setStateId(_orderStateId || 0);
        setPosition(_orderWizard?.currentPosition || null);
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
        if (!!_orderWizard) {
            _orderWizard.gotoPreviousGroup();
        }
        _scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, [_scrollViewRef]);

    const onNextGroup = useCallback(() => {
        if (!!_orderWizard) {
            _orderWizard.gotoNextGroup();
        }
        _scrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, [_scrollViewRef]);

    const onClose = useCallback(() => {
        if (!!_orderWizard) {
            _orderWizard.editCancel();
        }
    }, []);

    const changeQuantityHandler = (qnt: number) => {
        if (!!position) {
            position.quantity = qnt;
        }
    }

    const theme = _theme?.themes?.[_theme?.name] as IKioskThemeData;

    return (
        <>
            {
                !!theme &&
                <ModalRollTop theme={theme} visible={!!position}>
                    <View style={{ flex: 1, width: "100%" }}>
                        {
                            !!position && !!_language && !!_currency &&
                            <View style={{
                                flex: 1, width: "100%",
                                backgroundColor: theme.modifiers.backgroundColor,
                            }}>
                                <View style={{
                                    flexDirection: "row", width: "100%", maxHeight: "20%",
                                    marginBottom: 32, paddingLeft: 34, paddingRight: 34, paddingTop: 34,
                                }}>
                                    <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "flex-start", marginRight: 48, overflow: "hidden" }}>
                                        <View style={{ alignItems: "center" }}>
                                            <FastImage style={{ width: 128, height: 128, borderRadius: 16, overflow: "hidden" }} source={{
                                                uri: `file://${position.__product__?.contents[_language?.code]?.resources?.icon?.path}`,
                                            }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 30, marginRight: 30 }}>
                                            <Text style={{
                                                fontFamily: config.fontFamilyRegular,
                                                fontSize: theme.modifiers.nameFontSize,
                                                fontWeight: "600",
                                                color: theme.modifiers.nameColor,
                                            }}>{
                                                    position.__product__?.contents[_language.code]?.name
                                                }</Text>
                                            <Text style={{
                                                fontFamily: config.fontFamilyLite,
                                                fontSize: theme.modifiers.descriptionFontSize,
                                                color: theme.modifiers.descriptionColor,
                                                lineHeight: theme.modifiers.descriptionFontSize * 1.5,
                                            }}>{
                                                    position.__product__?.contents[_language.code]?.description
                                                }</Text>
                                        </View>
                                        <View style={{}}>
                                            <Text style={{
                                                fontFamily: config.fontFamilyRegular,
                                                backgroundColor: theme.modifiers.price.backgroundColor,
                                                paddingVertical: 8, paddingHorizontal: 8,
                                                // borderRadius: 14, borderWidth: 2, borderColor: theme.modifiers.price.borderColor,
                                                fontSize: theme.modifiers.price.textFontSize, fontWeight: "600",
                                                color: theme.modifiers.price.textColor,
                                                marginBottom: 12,
                                                textAlign: "center",
                                            }}>{
                                                    position.getFormatedSumPerOne(true)
                                                }</Text>
                                            <View style={{ width: 144, height: 48 }}>
                                                <NumericStapper
                                                    value={position.quantity}
                                                    buttonStyle={{
                                                        width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                                                        backgroundColor: theme.modifiers.item.quantityStepper.buttons.backgroundColor,
                                                        borderColor: theme.modifiers.item.quantityStepper.buttons.borderColor,
                                                        padding: 6
                                                    }}
                                                    buttonSelectedStyle={{
                                                        width: 48, height: 48, borderRadius: 16,
                                                        backgroundColor: theme.modifiers.item.quantityStepper.buttons.selectedBackgroundColor,
                                                        borderColor: theme.modifiers.item.quantityStepper.buttons.selectedBackgroundColor,
                                                        padding: 6,
                                                        opacity: 1
                                                    }}
                                                    disabledButtonStyle={{
                                                        width: 48, height: 48, borderStyle: "solid", borderWidth: 1, borderRadius: 16,
                                                        backgroundColor: theme.modifiers.item.quantityStepper.buttons.disabledBackgroundColor,
                                                        borderColor: theme.modifiers.item.quantityStepper.buttons.disabledBorderColor,
                                                        padding: 6,
                                                        opacity: 0.25
                                                    }}
                                                    disabledSelectedButtonStyle={{
                                                        width: 48, height: 48, borderRadius: 16,
                                                        backgroundColor: theme.modifiers.item.quantityStepper.buttons.disabledSelectedBackgroundColor,
                                                        borderColor: theme.modifiers.item.quantityStepper.buttons.disabledSelectedBorderColor,
                                                        padding: 6,
                                                        opacity: 0.25
                                                    }}
                                                    buttonTextStyle={{
                                                        fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                                                        color: theme.modifiers.item.quantityStepper.buttons.textColor as any,
                                                    }}
                                                    buttonSelectedTextStyle={{
                                                        fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                                                        color: theme.modifiers.item.quantityStepper.buttons.selectedTextColor as any,
                                                    }}
                                                    disabledButtonTextStyle={{
                                                        fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                                                        color: theme.modifiers.item.quantityStepper.buttons.disabledTextColor as any,
                                                    }}
                                                    disabledSelectedButtonTextStyle={{
                                                        fontSize: theme.modifiers.item.quantityStepper.buttons.textFontSize, fontWeight: "600",
                                                        color: theme.modifiers.item.quantityStepper.buttons.disabledSelectedTextColor as any,
                                                    }}
                                                    textStyle={{
                                                        fontSize: theme.modifiers.item.quantityStepper.indicator.textFontSize, fontWeight: "600",
                                                        color: theme.modifiers.item.quantityStepper.indicator.textColor
                                                    }}
                                                    iconDecrement="-"
                                                    iconIncrement="+"
                                                    onChange={changeQuantityHandler}
                                                    formatValueFunction={(value: number) => {
                                                        return String(value);
                                                    }}
                                                    min={1}
                                                    max={position.availableQuantitiy}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <CloseButton theme={theme} onPress={onClose}></CloseButton>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1,
                                    backgroundColor: theme.modifiers.group.backgroundColor,
                                    borderColor: theme.modifiers.group.borderColor,
                                    borderWidth: 1,
                                    paddingLeft: 34, paddingRight: 34, paddingTop: 34,
                                    borderTopLeftRadius: 32, borderTopRightRadius: 32, marginHorizontal: 24,
                                }}>
                                    <View style={{ width: "100%", alignItems: "center", marginBottom: 32 }}>
                                        <View style={{ width: "100%", flexDirection: "row", height: 4, maxWidth: 300, }}>
                                            {
                                                position.groups.map((gr, i) =>
                                                    <View key={gr.index} style={{
                                                        flex: 1, marginRight: 12, height: 6, borderRadius: 3,
                                                        backgroundColor: i === position?.currentGroup
                                                            ? gr.isValid
                                                                ? theme.modifiers.group.indicator.currentValidColor
                                                                : theme.modifiers.group.indicator.currentInvalidColor
                                                            : theme.modifiers.group.indicator.otherColor
                                                    }}></View>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", flexDirection: "row", marginBottom: -40, zIndex: 2 }}>
                                        <SimpleButton title={
                                            localize(_language, "kiosk_modifiers_group_prev_button")
                                        }
                                            styleView={{ opacity: 1 }}
                                            style={{
                                                backgroundColor: theme.modifiers.group.buttonPrevious.backgroundColor,
                                                borderColor: theme.modifiers.group.buttonPrevious.borderColor,
                                                borderRadius: 8, padding: 20
                                            }}
                                            styleDisabled={{
                                                backgroundColor: theme.modifiers.group.buttonPrevious.disabledBackgroundColor,
                                                borderRadius: 8, borderWidth: 2,
                                                borderColor: theme.modifiers.group.buttonPrevious.disabledBorderColor,
                                            }}
                                            textStyle={{
                                                fontWeight: "600",
                                                color: theme.modifiers.group.buttonPrevious.textColor,
                                                fontSize: theme.modifiers.group.buttonPrevious.textFontSize,
                                            }}
                                            textStyleDisabled={{
                                                fontWeight: "600",
                                                color: theme.modifiers.group.buttonPrevious.disabledTextColor,
                                                fontSize: theme.modifiers.group.buttonPrevious.textFontSize,
                                            }}
                                            disabled={position.currentGroup === 0} onPress={onPreviousGroup}></SimpleButton>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{
                                                fontFamily: config.fontFamilyRegular,
                                                fontSize: 24,
                                                fontWeight: "600",
                                                color: theme.modifiers.group.nameColor,
                                                textAlign: "center",
                                                marginBottom: 6,
                                            }}>{
                                                    position.groups[position.currentGroup].__node__.__rawNode__.content?.contents[_language.code]?.name
                                                }</Text>
                                            <Text style={{
                                                fontFamily: config.fontFamilyRegular,
                                                fontSize: 14,
                                                color: position.groups[position.currentGroup].isValid
                                                    ? theme.modifiers.group.descriptionColor
                                                    : theme.modifiers.group.descriptionInvalidColor,
                                                textAlign: "center",
                                            }}>{
                                                    position.groups[position.currentGroup].__node__.__rawNode__.content?.contents[_language.code]?.description
                                                }</Text>
                                        </View>
                                        <SimpleButton title={
                                            position.currentGroup === position.groups.length - 1
                                                ? localize(_language, "kiosk_modifiers_group_done_button")
                                                : localize(_language, "kiosk_modifiers_group_next_button")
                                        }
                                            styleView={{ opacity: 1 }}
                                            style={{
                                                backgroundColor: theme.modifiers.group.buttonNext.backgroundColor,
                                                borderColor: theme.modifiers.group.buttonNext.borderColor,
                                                borderRadius: 8, padding: 20
                                            }}
                                            styleDisabled={{
                                                backgroundColor: theme.modifiers.group.buttonNext.disabledBackgroundColor,
                                                borderRadius: 8, borderWidth: 2,
                                                borderColor: theme.modifiers.group.buttonNext.disabledBorderColor,
                                            }}
                                            textStyle={{
                                                fontWeight: "600",
                                                color: theme.modifiers.group.buttonNext.textColor,
                                                fontSize: theme.modifiers.group.buttonNext.textFontSize,
                                            }}
                                            textStyleDisabled={{
                                                fontWeight: "600",
                                                color: theme.modifiers.group.buttonNext.disabledTextColor,
                                                fontSize: theme.modifiers.group.buttonNext.textFontSize,
                                            }}
                                            disabled={!position.groups[position.currentGroup].isValid} onPress={onNextGroup}></SimpleButton>
                                    </View>
                                    <View style={{ flex: 1, width: "100%" }}>
                                        <LinearGradient
                                            colors={theme.modifiers.group.header.backgroundColor}
                                            style={{ display: "flex", position: "absolute", width: "100%", height: 96, zIndex: 1 }}
                                        >
                                        </LinearGradient>
                                        <SafeAreaView style={{
                                            flex: 1, width: "100%",
                                        }}>
                                            <ScrollView ref={_scrollViewRef as any} style={{ flex: 1, marginTop: 74 }} persistentScrollbar>
                                                <GridList style={{ flex: 1 }} disbleStartAnimation
                                                    padding={10} spacing={6} data={position.groups[position.currentGroup].positions}
                                                    itemDimension={MODIFIER_ITEM_WIDTH} animationSkipFrames={10} renderItem={({ item }) => {
                                                        return <ModifierListItem key={item.id} theme={theme} position={item} currency={_currency} language={_language}
                                                            thumbnailHeight={128} stateId={item.stateId}></ModifierListItem>
                                                    }}
                                                    keyExtractor={(item, index) => item.id}>
                                                </GridList>
                                            </ScrollView>
                                        </SafeAreaView>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                </ModalRollTop>
            }
        </>
    );
})

interface ICloseButtonProps {
    theme: IKioskThemeData;
    onPress: () => void;
}

const CloseButton = ({ theme, onPress }: ICloseButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ borderRadius: 32, backgroundColor: theme.modifiers.group.backgroundColor, width: 64, height: 64, alignItems: "center", justifyContent: "center" }}
            >
                <Icons name="Close" fill={theme.menu.backButton.iconColor} width={34} height={34} ></Icons>
            </View>
        </TouchableOpacity>
    )
}

const mapStateToProps = (state: IAppState, ownProps: IModifiersEditorProps) => {
    return {
        _orderWizard: MyOrderSelectors.selectWizard(state),
        _theme: CapabilitiesSelectors.selectTheme(state),
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