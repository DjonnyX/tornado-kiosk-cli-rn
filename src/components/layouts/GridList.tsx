import React, { useState, useCallback } from "react";
import { View, LayoutChangeEvent, StyleProp, ViewStyle, Animated, Easing } from "react-native";

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

const FPS = 1000 / 60;

export const GridList = ({ data, renderItem, style, keyExtractor, spacing = 0, padding = 0, animationSkipFrames = 0, itemDimension }: IGridListProps) => {
    const [cellWidth, _setCellWidth] = useState(new Animated.Value(1));
    const [gap, _setGap] = useState(spacing * 0.5);

    let cellAnimation: Animated.CompositeAnimation;

    cellAnimation = Animated.timing(cellWidth, {
        useNativeDriver: false,
        toValue: 0,
        duration: 250,
        easing: Easing.cubic,
    });

    const changeLayoutHandler = useCallback((event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        const numColumns = Math.floor(width / itemDimension);
        const gap = spacing * 0.5;
        const actualItemWidth = (width - padding * 2) / numColumns - (numColumns) * gap
        if (cellAnimation) {
            cellAnimation.stop();
        }
        cellAnimation = Animated.timing(cellWidth, {
            useNativeDriver: false,
            toValue: actualItemWidth,
            duration: 200,
            easing: Easing.cubic,
        });
        cellAnimation.start();
    }, []);

    return (
        <View
            style={{ width: "100%", height: "100%", ...style as any, padding }}
            onLayout={changeLayoutHandler}
        >
            <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {
                    data.map((item, index) =>
                        <Animated.View key={(keyExtractor(item, index))}
                            style={{ width: cellWidth, margin: gap, justifyContent: "center", overflow: "hidden" }}>
                            {
                                renderItem({ item, index })
                            }
                        </Animated.View>
                    )
                }
            </View>
        </View>
    )
}