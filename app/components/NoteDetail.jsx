import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import colors from '../misc/colors';
import RoundIconbtn from './RoundIconBtn';
import { useNotes } from '../context/NoteProvider';
import NoteInputModal from './NoteInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import RoundIconBtn from './RoundIconBtn';

const formatDate = (ms) => {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${year}-${month}-${day}(${hrs}시 ${min}분 ${sec}초)`;
};

const NoteDetail = (props) => {
    const [note, setNote] = useState(props.route.params.note);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const { setNotes } = useNotes();
    const headerHeight = useHeaderHeight();

    return (
        <>
            <ScrollView contentContainerStyle={[styles.conatiner, { paddingTop: headerHeight }]}>

                <Text style={styles.time}>
                    ${formatDate(note.time)}
                </Text>
                <Text style={styles.title}>
                    {note.title}
                </Text>
                <Text style={styles.desc}>
                    {note.desc}
                </Text>

            </ScrollView>
            <View style={styles.btnContainer}>
                <RoundIconBtn antIconName='delete' onPress={displayDeleteAlert} style={{ backgroundColor: colors.error, marginBottom: 15 }} />
                <RoundIconBtn antIconName='edit' onPress={openEditModal} />
            </View>
            <NoteInputModal isEdit={isEdit} note={note} onClose={handleOnClose} onSubmit={handleUpdate} visible={showModal} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    time: {
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.6
    },
    title: {
        fontSize: 30,
        color: colors.primary,
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 20,
        opacity: 0.8
    },
    btnContainer: {
        position: 'absolute',
        right: 15,
        bottom: 50
    }
})

export default NoteDetail;