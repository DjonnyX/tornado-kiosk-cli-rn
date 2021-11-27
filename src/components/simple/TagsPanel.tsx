import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ICompiledLanguage, ICompiledTag, IKioskThemeData } from "@djonnyx/tornado-types";
import Color from "color";
import { config } from "../../Config";

interface ITagListProps {
    theme: IKioskThemeData;
    language: ICompiledLanguage;
    tags: Array<ICompiledTag>;
    onSelect?: (selectedTags: Array<ICompiledTag>) => void;
}

export const TagsPanel = React.memo(({ theme, tags, language, onSelect }: ITagListProps) => {
    const [selectedTags, setSelectedTags] = useState<Array<ICompiledTag>>([]);

    useEffect(() => {
        if (onSelect !== undefined) {
            onSelect(selectedTags);
        }
    }, [selectedTags]);

    const onSelectHandler = useCallback((isSelected, tag) => {
        const selected = [...selectedTags];
        const index = selected.indexOf(tag);
        if (isSelected) {
            if (index === -1) {
                selected.push(tag);
            }
        } else {
            if (index > -1) {
                selected.splice(index, 1);
            }
        }
        setSelectedTags(selected);
    }, [selectedTags]);

    return (<View style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
        {
            tags?.map(tag =>
                <View key={tag.id} style={{ marginHorizontal: 3, marginVertical: 3 }}>
                    <TagButton theme={theme} language={language} tag={tag} onSelect={onSelectHandler}></TagButton>
                </View>
            )
        }
    </View>
    );
});

interface ITagButtonProps {
    theme: IKioskThemeData;
    language: ICompiledLanguage;
    tag: ICompiledTag;
    onSelect?: (value: boolean, tag: ICompiledTag) => void;
}

const TagButton = React.memo(({ theme, tag, language, onSelect }: ITagButtonProps) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        if (onSelect !== undefined) {
            onSelect(isSelected, tag);
        }
    }, [isSelected]);

    const onPressHandler = useCallback(() => {
        setIsSelected(!isSelected);
    }, [isSelected]);

    const backgroundColor = isSelected ? tag?.contents[language.code]?.color : theme.menu.tagsPanel.tag.backgroundColor;

    return (
        <TouchableOpacity style={{
            alignItems: "center",
            paddingVertical: 6, paddingHorizontal: 16,
            borderRadius: 32,
            backgroundColor,
        }} onPress={onPressHandler}>
            <View
                style={{

                }}
            >
                <Text style={{
                    fontFamily: config.fontFamilyLite,
                    fontWeight: "500",
                    textTransform: "lowercase",
                    color: Color(backgroundColor).isLight() ? theme.menu.tagsPanel.tag.textColorDark : theme.menu.tagsPanel.tag.textColorLight,
                    fontSize: theme.menu.tagsPanel.tag.fontSize,
                    lineHeight: 17,
                }}>
                    {
                        tag?.contents[language.code]?.name
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );
});