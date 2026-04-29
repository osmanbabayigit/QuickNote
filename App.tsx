import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from './src/theme/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import AddNoteScreen from './src/screens/AddNoteScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';
import EditNoteScreen from './src/screens/EditNoteScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [notes, setNotes] = useState([]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
            >
              <Stack.Screen name="Home">
                {(props) => <HomeScreen {...props} notes={notes} setNotes={setNotes} />}
              </Stack.Screen>
              <Stack.Screen name="AddNote">
                {(props) => <AddNoteScreen {...props} setNotes={setNotes} />}
              </Stack.Screen>
              <Stack.Screen name="NoteDetail">
                {(props) => <NoteDetailScreen {...props} notes={notes} setNotes={setNotes} />}
              </Stack.Screen>
              <Stack.Screen name="EditNote">
                {(props) => <EditNoteScreen {...props} notes={notes} setNotes={setNotes} />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}