import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteProvider from './app/context/NoteProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteScreen from './app/screens/NoteScreen';
import Intro from './app/screens/Intro';
import NoteDetail from './app/components/NoteDetail';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});
  const [isAppFirstOpen, setIsAppFirstOpen] = useState(false);

  const findUser = async () => {
    try {
      const result = await AsyncStorage.getItem('user');
      if (result === null) return setIsAppFirstOpen(true);

      setUser(JSON.parse(result));
      setIsAppFirstOpen(false);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    findUser();
  }, []);

  const RenderNoteScreen = (props) => <NoteScreen {...props} user={user} />
  if (isAppFirstOpen) return <Intro onFinish={findUser} />

  return (
    <NavigationContainer>
      <NoteProvider>
        <Stack.Navigator screenOptions={{ headerTitle: '', headerTransparent: true }} >
          <Stack.Screen component={RenderNoteScreen} name='NoteScreen' />
          <Stack.Screen component={NoteDetail} name='NoteDetail' />
        </Stack.Navigator>
      </NoteProvider>

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
});
