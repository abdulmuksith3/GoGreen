import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, LogBox, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState("")

  useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
        <Text>Profile SCREEN</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('DetailsHome')}>
          <Text>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>firebase.auth().signOut()}>
          <Text>LOGOUT</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // height:"100%",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:colors.GRAY
  }
});
