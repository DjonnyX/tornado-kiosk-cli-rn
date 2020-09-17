import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View, Button, Text } from "react-native";

interface ILoadingSelfProps {
    [x: string]: any;
}

interface ILoadingProps extends StackScreenProps<ILoadingSelfProps, 'Loading'> { }

export const LoadingScreen = ({ navigation }: ILoadingProps) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading screen</Text>
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    );
  }