import React from "react";
import { View, Text } from "react-native";
import { LanguagePicker } from "./LanguagePicker";
import { ICompiledLanguage, ICompiledOrderType, ICurrency, IKioskThemeData } from "@djonnyx/tornado-types";
import { OrderTypesPicker } from "./OrderTypesPicker";
import { MyOrderList } from "./my-order-list";
import { CtrlMenuButton } from "./CtrlMenuButton";
import { localize } from "../../utils/localization";
import { IOrderWizard } from "../../core/interfaces";

interface IMyOrderPanelProps {
    theme: IKioskThemeData;
    orderStateId: number;
    currency: ICurrency;
    language: ICompiledLanguage;
    languages: Array<ICompiledLanguage>;
    orderType: ICompiledOrderType;
    orderTypes: Array<ICompiledOrderType>;
    isShowOrderTypes: boolean;
    orderWizard: IOrderWizard | undefined;

    onChangeLanguage: (lang: ICompiledLanguage) => void;
    onChangeOrderType: (orderType: ICompiledOrderType) => void;
    onConfirm: () => void;
}

export const MyOrderPanel = React.memo(({ theme, orderStateId, currency, language, languages, orderType, orderTypes,
    isShowOrderTypes, orderWizard, onChangeLanguage, onChangeOrderType, onConfirm,
}: IMyOrderPanelProps) => {
    return (
        <View
            style={{ flex: 1, backgroundColor: theme.menu.orderPanel.backgroundColor }}
        >
            <View style={{ padding: 12, alignItems: "center" }}>
                {
                    !!languages && languages.length > 0 &&
                    <View style={{ margin: "auto", marginTop: 12, marginBottom: 20, alignItems: "center" }}>
                        <LanguagePicker theme={theme} language={language} languages={languages} onSelect={onChangeLanguage}></LanguagePicker>
                    </View>
                }
                {
                    !!orderTypes && orderTypes.length > 1 &&
                    <View style={{ margin: "auto", marginBottom: 20, alignItems: "center", width: "100%" }}>
                        <OrderTypesPicker theme={theme} isShow={isShowOrderTypes} language={language} orderType={orderType}
                            orderTypes={orderTypes} onSelect={onChangeOrderType}
                            style={{
                                flex: 1,
                                width: "100%",
                                backgroundColor: theme.orderTypePicker.backgroundColor,
                                borderColor: theme.orderTypePicker.borderColor,
                            }}
                            textStyle={{
                                width: "100%",
                                textAlign: "center",
                                color: theme.orderTypePicker.textColor,
                                fontSize: theme.orderTypePicker.textFontSize,
                            }} />
                    </View>
                }
                {
                    orderWizard?.positions.length !== 0 &&
                    <View style={{ margin: "auto", marginBottom: 12, alignItems: "center" }}>
                        <Text style={{ fontWeight: "600", fontSize: theme.menu.sum.price.textFontSize, color: theme.menu.sum.price.textColor }}>
                            {
                                orderWizard?.getFormatedSum(true)
                            }
                        </Text>
                    </View>
                }
            </View>
            <View style={{ flex: 1, flexGrow: 1, margin: "auto" }}>
                <MyOrderList />
            </View>
            <View style={{ flex: 0, height: 124, margin: "auto", paddingHorizontal: 12, paddingVertical: 12, }}>
                {
                    orderWizard?.positions.length !== 0 &&
                    <CtrlMenuButton text={
                        localize(language, "kiosk_menu_confirm_button")
                    } disabled={orderWizard?.positions.length === 0}
                        gradient={theme.menu.ctrls.confirmButton.backgroundColor}
                        gradientDisabled={theme.menu.ctrls.confirmButton.disabledBackgroundColor}
                        onPress={onConfirm}></CtrlMenuButton>
                }
            </View>
        </View>
    )
})