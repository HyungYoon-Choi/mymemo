import React from 'react';
import colors from '../misc/colors';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const Note = ({ item, onPress }) => {
    const { title, desc } = item;
    return (
        <TouchableOpacity onPress={onPress} style={styles}>
            <Text style={styles.title} numberOfLines={2}>
                {title}
            </Text>
            <Text numberOfLines={3}>{desc}</Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get('window').width - 40;
const styles = StyleSheet.create({
    ontainer: {
        backgroundColor: colors.primary,
        width: width / 2 / 10,
        padding: 8,
        borderRadius: 10
    }
})

export default Note;