import React, { Dispatch, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors } from "../../store/selectors";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import Video from "react-native-video";

interface IIntroSelfProps {
    // store props
    _intros: Array<ICompiledAd>;
    _defaultLanguageCode: string;

    // self props
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = ({ _defaultLanguageCode, _intros, navigation }: IIntroProps) => {
    const [currentAdIndex, _setCurrentAdIndex] = useState(0);

    const nextCurrentAdIndex = () => {
        _setCurrentAdIndex(prevAdIndex => {
            if (prevAdIndex + 1 > _intros.length - 1) {
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
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }

    const endVideoHandler = () => {
        nextCurrentAdIndex();
    }

    const currentIntroContent = !!_intros && _intros.length > 0 ? _intros[currentAdIndex].contents[_defaultLanguageCode] : undefined;
    const currentIntroAsset = currentIntroContent?.resources?.main;

    const isVideo = currentIntroAsset?.ext === '.mp4';

    if (!isVideo) {
        updateTimerOfDuration(currentIntroContent?.duration || 0);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} onPress={pressHandler}>
                {
                    !!currentIntroAsset
                        ?
                        isVideo
                            ?
                            <Video style={{ width: '100%', height: '100%' }} resizeMode={"cover"} source={{
                                uri: `file://${currentIntroAsset?.path}`,
                            }} controls={false} onEnd={endVideoHandler}></Video>
                            :
                            <Image style={{ width: '100%', height: '100%' }} source={{
                                uri: `file://${currentIntroAsset?.path}`,
                            }}></Image>
                        :
                        <></>
                }
            </TouchableOpacity>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
    return {
        _intros: CombinedDataSelectors.selectIntros(state),
        _defaultLanguageCode: CombinedDataSelectors.selectDefaultLanguageCode(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {};
};

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);