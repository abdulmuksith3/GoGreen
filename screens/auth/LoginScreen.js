import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, LogBox} from 'react-native';
import {colors} from '../../theme/colors';

export default function LoginScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.containerBottom}>

      <View style={styles.containerLeft}>

      </View>
      <View style={styles.containerRight}>

      </View>
      </View>

      <View style={styles.containerTop}>
        <View style={styles.top}>

        </View>
        <View style={styles.bottom}>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // backgroundColor:colors.WHITE
  },


  containerBottom: {
    flex: 1,
    flexDirection:"row",
    position:"absolute",
    height:"100%",
    width:"100%"
  },
  containerLeft:{
    flex:1,
    backgroundColor:colors.GREEN
  },
  containerRight:{
    flex:1,
    backgroundColor:colors.WHITE
  },


  containerTop:{
    flex:1,
    // backgroundColor:"transparent",
  },
  top:{
    flex:1,
    backgroundColor: colors.GREEN,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius:50
  },
  bottom:{
    flex:1,
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 50,
    borderTopRightRadius:50
  },
});
