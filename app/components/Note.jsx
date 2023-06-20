import React, { useEffect, useState } from 'react';
import colors from '../misc/colors';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const Note = ({ item, onPress }) => {
    const [bkColor, setBkColor] = useState('colors.primary')
    const { title, desc } = item;
    useEffect(() => {
        const bcolor = [colors.primary, colors.secondery, colors.tertiary, colors.quaterbary, colors.quinary]
        setBkColor(bcolor[Math.floor(Math.random() * 5)])
    }, [])
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: bkColor }]}>
            <Text style={styles.title} numberOfLines={2}>
                {title}
            </Text>
            <Text numberOfLines={3}>{desc}</Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get('window').width - 40;
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        width: width / 2 - 10,
        padding: 8,
        borderRadius: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.dark
    }
})

export default Note;