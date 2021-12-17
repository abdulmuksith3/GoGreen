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
import {
  useFonts,
  // Poppins_100Thin,
  // Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  // Poppins_200ExtraLight_Italic,
  // Poppins_300Light,
  // Poppins_300Light_Italic,
  Poppins_400Regular,
  // Poppins_400Regular_Italic,
  // Poppins_500Medium,
  // Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  // Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  // Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  // Poppins_800ExtraBold_Italic,
  // Poppins_900Black,
  // Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
LogBox.ignoreAllLogs();


export default function App() {
  let [fontsLoaded] = useFonts({
    // Poppins_100Thin,
    // Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    // Poppins_200ExtraLight_Italic,
    // Poppins_300Light,
    // Poppins_300Light_Italic,
    Poppins_400Regular,
    // Poppins_400Regular_Italic,
    // Poppins_500Medium,
    // Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    // Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    // Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    // Poppins_800ExtraBold_Italic,
    // Poppins_900Black,
    // Poppins_900Black_Italic,
  });
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  if(!fontsLoaded){
    return <AppLoading />
  } else {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45A05D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
