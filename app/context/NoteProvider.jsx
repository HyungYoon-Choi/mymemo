import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteContext = createContext();

const NoteProvider = ({ children }) => {

    const [notes, setNotes] = useState([]);

    const findNotes = async () => {
        try {
            const result = await AsyncStorage.getItem('notes');
            if (result !== null) setNotes(JSON.parse(result));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const saveNotes = async () => {
            try {
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
            } catch (error) {
                // handle or throw error
                console.error(error);
            }
        };
        saveNotes();
    }, [notes]);

    return (
        <NoteContext.Provider value={{ notes, setNotes, findNotes }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNotes = () => useContext(NoteContext);
export default NoteProvider;