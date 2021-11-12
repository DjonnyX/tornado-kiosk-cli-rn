import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ICompiledLanguage, ICompiledTag, IKioskThemeData } from "@djonnyx/tornado-types";

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
                <View style={{ marginHorizontal: 3, marginVertical: 3 }}>
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


    return (
        <TouchableOpacity style={{
            paddingVertical: 6, paddingHorizontal: 12,
            borderRadius: 32,
            backgroundColor: isSelected ? tag?.contents[language.code]?.color : "rgb(220,220,220)"
        }} onPress={onPressHandler}>
            <View
                style={{

                }}
            >
                <Text style={{
                    color: "black"/*theme.menu.tagsPanel.tag.textColor*/,
                    fontSize: 16/*theme.menu.tagsPanel.tag.textSize*/,
                }}>
                    {
                        tag?.contents[language.code]?.name
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );
});