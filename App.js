import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, LogBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firebase from "firebase";
import "firebase/auth";
import db from './db';
import AuthContainer from './navigator/AuthContainer'
import AppContainer from './navigator/AppContainer'
LogBox.ignoreAllLogs();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);


  return (
    // user !== false ? (
      user !== null ? (
        <AppContainer />
      ) : (
        <AuthContainer />
      )
    // ) : null
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
