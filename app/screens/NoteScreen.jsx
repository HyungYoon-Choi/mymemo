import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Text, TouchableWithoutFeedback, StatusBar, FlatList, Keyboard, SafeAreaView } from 'react-native';
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
    const [greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);
    const { notes, setNotes, findNotes } = useNotes();
    const [filteredNotes, setFilteredNotes] = useState(notes);

    const findGreet = () => {
        const hrs = new Date().getHours();
        if (hrs === 0 || hrs < 12) return setGreet("오전");
        if (hrs === 1 || hrs < 17) return setGreet("오후");
        setGreet("밤");
    }

    useEffect(() => {
        findGreet();
    }, []);

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    useEffect(() => {
        const loadNotes = async () => {
            const savedNotes = await AsyncStorage.getItem('notes');
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        }
        loadNotes();
    }, []);

    const reverseNotes = useMemo(() => reverseData(notes), [notes]);

    const handleOnSubmit = async (title, desc) => {
        const note = { id: Date.now(), title, desc, time: Date.now() };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    }

    const openNote = (note) => {
        navigation.navigate('NoteDetail', { note })
    }

    const handleOnClear = async () => {
        setSearchQuery('');
        setResultNotFound(false);
        await findNotes();
    }

    const handleOnSearchInput = text => {
        setSearchQuery(text);
        if (!text.trim()) {
            setSearchQuery('');
            setResultNotFound(false);
            setFilteredNotes(notes);
            return;
        }
        const filtered = notes.filter(note =>
            note.title.toLowerCase().includes(text.toLowerCase())
        );
        if (filtered.length) {
            setFilteredNotes(filtered);
        } else {
            setResultNotFound(true);
        }
    }

    return (
        < SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.light} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.greet}>
                        {user.name}님, {greet}입니다. 반갑습니다.
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
                            data={reverseData(filteredNotes)}
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
        </ SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    greet: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: colors.dark
    },
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