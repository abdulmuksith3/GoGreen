import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, LogBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotScreen from '../screens/auth/ForgotScreen';

const Stack = createNativeStackNavigator();

export default function AuthContainer() { 
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" >
          <Stack.Screen name="Welcome" component={WelcomeScreen} 
            options={{
              headerShown:false
            }}
          />

          <Stack.Screen name="Login" component={LoginScreen}
            options={{
              headerShown:false
            }}
          />

          <Stack.Screen name="Register" component={RegisterScreen} 
            options={{
              headerShown:false
            }}
          />

          <Stack.Screen name="Forgot" component={ForgotScreen} 
            options={{
              headerShown:false
            }}
          />          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }