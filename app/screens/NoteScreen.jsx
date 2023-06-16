import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Text, TouchableWithoutFeedback, StatusBar, FlatList, Keyboard } from 'react-native';
import Note from '../components/Note';
import NotFound from '../components/NotFound';
import RoundIconBtn from '../components/RoundIconBtn';
import colors from '../misc/colors';
import { useNotes } from '../context/NoteProvider';
import NoteInputModal from '../components/NoteInputModal';
import SearchBar from '../components/SearchBar';

const reverseData = (data) => {
    return data.sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt === bInt) return 0;
        if (aInt > bInt) return -1;
    });
}

const NoteScreen = ({ user, navigation }) => {
    const [great, setGreat] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);
    const { notes, setNotes, findNotes } = useNotes();
    const findGreat = () => {
        const hrs = new Date().getHours();
        if (hrs === 0 || hrs < 12) return setGreat("오전");
        if (hrs === 1 || hrs < 17) return setGreat("오후");
        setGreat("밤");
    }
    useEffect(() => {
        findGreat();
    }, []);
    const reverseNotes = reverseData(notes);

    const handleOnSubmit = async (title, desc) => {
        const note = { id: Date.now(), title, desc, time: Date.now() };
        const updateNotes = [...notes, note];
        setNotes(updateNotes);
        await AsyncStorage.setItem('ntoes', JSON.stringify(updateNotes));
    }

    const openNote = (note) => {
        navigation.navigate('NoteDetail', { note })
    }

    const handleOnSearchInput = async text => {
        setSearchQuery(text);
        if (!text.trim()) {
            setSearchQuery('');
            setResultNotFound(false);
            return await findNotes();
        }
        const filterNote = notes.filter(note => {
            if (note.title.toLowerCase().include(text.toLowerCase())) {
                return note;
            }
        });

        if (filterNote.length) {
            setNotes([...filterNote]);
        } else {
            setResultNotFound(true)
        }
    }

    const handleOnClear = async () => {
        setSearchQuery('');
        setResultNotFound(false);
        await findNotes();
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.light} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text>
                        {user.name}님이 {great}에 쓰심.
                    </Text>
                    {notes.length ? (
                        <SearchBar
                            value={searchQuery}
                            onChangeText={handleOnSearchInput}
                            containerStyle={{ marginVertical: 15 }}
                            onClear={handleOnClear}
                        />
                    ) : null}

                    {resultNotFound ? (
                        <NotFound />
                    ) : (
                        <FlatList
                            data={reverseNotes}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (<Note onPress={() => openNote(item)} item={item} />)}
                        />
                    )}
                    {
                        !notes.length ? (
                            <View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                                <Text style={styles.emptyHeader}>
                                    Add Notes
                                </Text>
                            </View>
                        ) : null
                    }
                </View>
            </TouchableWithoutFeedback>

            <RoundIconBtn antIconName='plus' style={styles.addBtn} onPress={() => setModalVisible(true)} />
            <NoteInputModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleOnSubmit} />
        </>
    );
};
const styles = StyleSheet.create({
    header: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    emptyHeader: {
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        opacity: 0.2
    },
    addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 50,
        zIndex: 1
    }
})

export default NoteScreen;