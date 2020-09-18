import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, Image } from "react-native";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";

interface IAdProps {
    // store
    ads: string;

    // self

    // for stack navigator
    [x: string]: any;
}

interface IAdProps extends StackScreenProps<IAdProps, 'Ad'> { }

const AdScreenContainer = ({ ads, navigation }: IAdProps) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ position: 'absolute', width: '100%', height: '100%' }} source={{
                uri: `file://${ads}`,
                scale: 1,
            }}></Image>
        </View>
    );
}

const mapStateToProps = (state: IAppState, ownProps: IAdProps) => {
    console.log("state", state)
    return {
        ads: (state.combinedData?.data?.refs as any)?.assets[55].path,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        /*_onChange: (data: ICompiledData) => {
            dispatch(CombinedDataActions.setData(data));
        }*/
    };
};

export const AdScreen = connect(mapStateToProps, mapDispatchToProps)(AdScreenContainer);
  // navigation.navigate('Profile')