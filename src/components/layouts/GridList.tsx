import React, { useState } from "react";
import { View, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";

interface IGridListProps<T = any> {
    children?: never[];
    style?: StyleProp<ViewStyle>;
    padding?: number;
    data: Array<T>;
    itemDimension: number;
    spacing?: number;
    animationSkipFrames?: number;
    renderItem: (data: { item: T, index: number }) => JSX.Element;
    keyExtractor: (item: T, index: number) => number;
}

export const GridList = ({ data, renderItem, style, keyExtractor, spacing = 0, padding = 0, animationSkipFrames = 0, itemDimension }: IGridListProps) => {
    const [bound, _setBound] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const numColumns = Math.floor(bound.width / itemDimension);
    const gap = spacing * 0.5;
    const actualItemWidth = (bound.width - padding * 2) / numColumns - (numColumns) * gap * 0.5
    let frameCount = 0;
    let timer: any;

    const onLayout = (event: LayoutChangeEvent) => {
        frameCount++;

        // остановка таймера
        if (!!timer) {
            clearTimeout(timer);
        }

        const { x, y, width, height } = event.nativeEvent.layout;

        // лэйаут переопределяется только при инициализации и если пропущено количество фреймов заданное с помощью "animationSkipFrames"
        if (frameCount > animationSkipFrames || !(bound.width && bound.height)) {
            _setBound(prevBound => ({ x, y, width, height }));
        } else {
            // отложенное переопределение лэйаута
            timer = setTimeout(() => {
                _setBound(prevBound => ({ x, y, width, height }));
            }, 50);
        }
    }

    return (
        <View
            style={{ flex: 1, height: "100%", ...style as any, padding }}
            onLayout={onLayout}
        >
            <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {
                    bound.width && bound.height
                        ?
                        data.map((item, index) =>
                            <View key={(keyExtractor(item, index))} style={{ width: actualItemWidth, margin: gap, justifyContent: "center", overflow: "hidden" }}>
                                {
                                    renderItem({ item, index })
                                }
                            </View>
                        )
                        :
                        undefined
                }
            </View>
        </View>
    )
}