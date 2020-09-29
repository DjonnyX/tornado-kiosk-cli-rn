import React, { useState } from "react";
import { View, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import Video from "react-native-video";

interface IAdsProps {
    ads: Array<ICompiledAd>;
    languageCode: string;
    onPress: (ad: ICompiledAd) => void;
}

export const Ads = ({ languageCode, ads, onPress }: IAdsProps) => {
    const [currentAdIndex, _setCurrentAdIndex] = useState(0);

    const nextCurrentAdIndex = () => {
        _setCurrentAdIndex(prevAdIndex => {
            if (prevAdIndex + 1 > ads.length - 1) {
                prevAdIndex = 0;
            } else {
                prevAdIndex += 1;
            }
            return prevAdIndex;
        });
    };

    const updateTimerOfDuration = (duration = 0) => {
        if (duration > 0) {
            setTimeout(nextCurrentAdIndex, duration * 1000);
        }
    };

    const pressHandler = (e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(ads[currentAdIndex]);
        }
    }

    const endVideoHandler = () => {
        nextCurrentAdIndex();
    }

    const currentAdContent = !!ads && ads.length > 0 ? ads[currentAdIndex].contents[languageCode] : undefined;
    const currentAdAsset = currentAdContent?.resources?.main;

    const isVideo = currentAdAsset?.ext === '.mp4';

    if (!isVideo) {
        updateTimerOfDuration(currentAdContent?.duration || 0);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} onPress={pressHandler}>
                {
                    !!currentAdAsset
                        ?
                        isVideo
                            ?
                            <Video style={{ width: '100%', height: '100%' }} resizeMode={"cover"} source={{
                                uri: `file://${currentAdAsset?.path}`,
                            }} controls={false} onEnd={endVideoHandler}></Video>
                            :
                            <Image style={{ width: '100%', height: '100%' }} source={{
                                uri: `file://${currentAdAsset?.path}`,
                            }}></Image>
                        :
                        <></>
                }
            </TouchableOpacity>
        </View>
    );
}