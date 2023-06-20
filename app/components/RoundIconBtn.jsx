
import React from 'react';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const RoundIconBtn = ({ antIconName, size, color, style, onPress }) => {
    return (
        <AntDesign
            name={antIconName}
            size={size || 25}
            color={color || colors.light}
            style={[styles.icon, { ...style }]}
            onPress={onPress}
        />
    );
};
const styles = StyleSheet.create({
    icon: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 50,
        // android
        elevation: 5,
        // ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 4
    }
})
export default RoundIconBtn;