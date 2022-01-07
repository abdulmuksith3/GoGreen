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
import AppLoading from 'expo-app-loading';
import FlashMessage from "react-native-flash-message";
import {
  useFonts,
  Poppins_200ExtraLight,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
LogBox.ignoreAllLogs();


export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_200ExtraLight,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  if(!fontsLoaded){
    return <AppLoading />
  } else {
    return (
      user !== null ? (
        <>
        {/* <StatusBar style="auto" backgroundColor='#fff'/> */}
        <AppContainer />
        <FlashMessage position="bottom" />
        </>
      ) : (
        <>
        <AuthContainer />
        <FlashMessage position="bottom" />
        </>
      )
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45A05D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
