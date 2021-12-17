import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, LogBox, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const Stack = createNativeStackNavigator();

function HomeScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home1</Text>
        <TouchableOpacity onPress={()=>firebase.auth().signOut()}>
          <Text>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function DetailsScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }

export default function AppContainer() { 
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }