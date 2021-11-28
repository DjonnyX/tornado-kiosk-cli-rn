import React from "react";
import { Text, View } from "react-native";
import { ICompiledLanguage, IKioskThemeData } from "@djonnyx/tornado-types";
import Color from "color";
import { config } from "../../Config";
import { IPositionWizardGroup } from "../../core/interfaces";

interface IWizardIndicatorProps {
    theme: IKioskThemeData;
    language: ICompiledLanguage;
    groups: Array<IPositionWizardGroup>;
    currentGroup: number;
    positionStateId: number;
}

export const WizardIndicator = React.memo(({
    theme, language, groups, currentGroup, positionStateId
}: IWizardIndicatorProps) => {
    return (<View style={{ width: "100%", alignItems: "center", marginBottom: 32 }}>
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", height: "auto", maxWidth: 300, }}>
            {
                groups?.map((group, index) =>
                    <WizardIndicatorGroup
                        key={group.index}
                        theme={theme} language={language} group={group} stateId={positionStateId}
                        num={index + 1} index={index} currentGroup={currentGroup}
                        selected={index === currentGroup} isLast={index + 1 === groups?.length} />
                )
            }
        </View>
    </View>
    );
});

interface IWizardIndicatorGroupProps {
    theme: IKioskThemeData;
    language: ICompiledLanguage;
    group: IPositionWizardGroup;
    stateId: number;
    num: number;
    index: number;
    currentGroup: number;
    selected: boolean;
    isLast: boolean;
}

const WizardIndicatorGroup = React.memo(({
    theme, language, group, stateId, num, index,
    currentGroup, isLast = false, selected = false
}: IWizardIndicatorGroupProps) => {
    const backgroundColor = selected
        ? group?.isValid
            ? theme.modifiers.group.indicator.currentValidColor
            : theme.modifiers.group.indicator.currentInvalidColor
        : index < currentGroup
            ? theme.modifiers.group.indicator.currentValidColor
            : theme.modifiers.group.indicator.otherColor;

    return (
        <View style={{ position: "relative", marginRight: 6 }}>
            <View style={{
                alignItems: "center",
                padding: !isLast ? 6 : 0,
                borderRadius: 32,
                height: 32,
                width: 32,
                backgroundColor,
                borderColor: Color(backgroundColor).darken(0.35).toString(),
                borderWidth: selected ? 4 : 0, 
            }}>
                <View
                    style={{
                        flex: 1,
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{
                        fontFamily: config.fontFamilyLite,
                        fontWeight: "500",
                        color: Color(backgroundColor).isLight() ? "#000" : "#fff",
                        fontSize: 14, // theme.menu.WizardIndicator.tag.fontSize,
                        lineHeight: 17,
                    }}>
                        {
                            num
                        }
                    </Text>
                </View>
            </View>
            {
                !isLast &&
                <View style={{
                    position: "absolute",
                    width: 6,
                    height: 4,
                    left: 32,
                    top: 14,
                    backgroundColor,
                }} />
            }
        </View>
    );
});