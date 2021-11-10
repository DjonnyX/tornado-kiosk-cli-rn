import React, { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from 'react-native-fast-image'
import Video from "react-native-video";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { ICompiledLanguage, AssetExtensions, ICompiledAdContents, IAsset, IKioskThemeData } from "@djonnyx/tornado-types";

interface IAdsProps {
    theme: IKioskThemeData;
    menuStateId: number;
    ads: Array<ICompiledAd>;
    language: ICompiledLanguage;
    onPress: (ad: ICompiledAd) => void;
}

interface IAdsParams {
    currentAdContent: ICompiledAdContents | undefined;
    currentAdAsset: IAsset | undefined;
    isVideo: boolean;
}

export const Ads = React.memo(({ theme, menuStateId, language, ads, onPress }: IAdsProps) => {
    const [currentAdIndex, _setCurrentAdIndex] = useState(0);
    const [params, setParams] = useState<IAdsParams | undefined>();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!!ads && currentAdIndex !== undefined) {
            const currentAdContent = !!ads && ads.length > 0 && !!ads[currentAdIndex] ? ads[currentAdIndex].contents[language?.code] : undefined;
            const currentAdAsset = currentAdContent?.resources?.main;

            const isVideo = currentAdAsset?.ext === AssetExtensions.MP4;

            setParams({
                currentAdContent,
                currentAdAsset,
                isVideo
            });

            if (!isVideo) {
                const duration = currentAdContent?.duration || 0;
                if (duration > 0) {
                    timeout = setTimeout(nextCurrentAdIndex, duration * 1000);
                }
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [ads, currentAdIndex]);

    const nextCurrentAdIndex = useCallback(() => {
        _setCurrentAdIndex(prevAdIndex => {
            if (ads.length > 1) {
                if (prevAdIndex + 1 > ads.length - 1) {
                    prevAdIndex = 0;
                } else {
                    prevAdIndex += 1;
                }
            }
            return prevAdIndex;
        });
    }, [ads]);

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(ads?.[currentAdIndex]);
        }
    }, [currentAdIndex]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} onPress={pressHandler}>
                {
                    !!params && !!params.currentAdAsset
                        ?
                        params.isVideo
                            ?
                            <Video style={{ width: "100%", height: "100%" }} resizeMode={"cover"} source={{
                                uri: `file://${params.currentAdAsset?.path}`,
                            }} controls={false} repeat={true}></Video>
                            :
                            <FastImage style={{ width: "100%", height: "100%" }} source={{
                                uri: `file://${params.currentAdAsset?.path}`,
                            }} resizeMode={FastImage.resizeMode.cover}></FastImage>
                        :
                        <></>
                }
            </TouchableOpacity>
        </View>
    );
})