import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, LogBox, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true);
          // console.log("KEYBOARD SHOW")
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false);
          // console.log("KEYBOARD HIDE")
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
  }, []);

  const login = () => {
    if (email.length === 0 || password.length === 0) {
      showErrorMessage("Email and Password cannot be empty");
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((data) => {
        showSuccessMessage("Successful Login")
      })
      .catch((error) => {
          if (error.code === "auth/user-not-found") {
            showErrorMessage("User does not exist")
            return false;
          }
          if (error.code === "auth/wrong-password") {
            showErrorMessage(`Email or Password wrong`)
            return false;
          }
          if (error.code === "auth/invalid-email") {
            showErrorMessage(`The email address is invalid!`)
            return false;
          }
          console.log("CODE: ", error.code);
          console.log("MSG: ",error.message);
      });
    }
  };

  const anonymousLogin = () => {
    firebase.auth().signInAnonymously()
      .then((data) => {
        console.log("Successful Anonymous Login - ", data)
      })
      .catch((error) => {
          if (error.code === "auth/admin-restricted-operation") {
            console.log("Access restricted")
            return false;
          }
          console.log("CODE: ", error.code);
          console.log("MSG: ",error.message);
      });
  };

  const showErrorMessage = (message) => {
    showMessage({
      message: message,
      // description: description,
      type: "default",
      backgroundColor: colors.RED,
      color: colors.WHITE,
      floating: true,
      icon:{
        icon:"danger",
        position:"right"
      },
      titleStyle:{
        fontFamily: font.REGULAR
      }
    });
  };

  const showSuccessMessage = (message) => {
    showMessage({
      message: message,
      // description: description,
      type: "default",
      backgroundColor: colors.LIGHT_GREEN,
      color: colors.WHITE,
      floating: true,
      icon:{
        icon:"success",
        position:"right"
      },
      titleStyle:{
        fontFamily: font.REGULAR
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios"&& "padding"}>
      <View style={styles.containerBottom}>
      <View style={styles.containerLeft}></View>
      <View style={styles.containerRight}></View>
      </View>
      
      <View style={styles.containerTop}>
        <View style={styles.top}>
          <Text style={{fontFamily:font.REGULAR}}>LOGO logo</Text>
        </View>
        <View style={styles.bottom}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {!isKeyboardVisible && <View style={{flex:0.5}}></View>}
            <View style={styles.inputView}>
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Email Address</Text>
                <Input 
                  placeholder='josh@example.com'
                  onChangeText={(x)=> setEmail(x)}
                  value={email}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  // errorStyle={}
                  
                />
              </View>
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Password</Text>
                <Input 
                  placeholder="*********" 
                  secureTextEntry={!passwordVisible}
                  onChangeText={(x)=> setPassword(x)}
                  value={password}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  rightIcon={
                    <TouchableOpacity onPress={()=>setPasswordVisible(!passwordVisible)}>
                      <Icon
                        name={passwordVisible ? 'eye' : 'eye-off'}
                        size={18}
                        color={colors.DARK_GRAY}
                        type="feather"
                      />
                    </TouchableOpacity>                  
                  }

                />
                <TouchableOpacity onPress={()=>navigation.navigate("Forgot")} style={styles.forgotPasswordView}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>   
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={()=> login()} style={styles.loginButton}>
                <Text style={styles.loginText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
            {!isKeyboardVisible &&            
              <View style={styles.bottomTextView}>
                <Text style={styles.signupTextOne}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=> navigation.navigate("Register")} style={styles.signupButton}>
                  <Text style={styles.signupTextTwo}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            }
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity onPress={()=> anonymousLogin()} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    borderBottomRightRadius:50,
    justifyContent:"center",
    alignItems:"center"
  },
  bottom:{
    flex:1,
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 50,
    borderTopRightRadius:50,
    // padding:"0%"
    // justifyContent:"center",
    // alignItems:"center"
  },
  inputView:{
    flex:4,
    width:"80%",
    justifyContent:"center",
    alignItems:"center",
    // backgroundColor:"green"
  },
  singleInputView:{
    width:"100%",
    // borderWidth:1,
    justifyContent:"flex-end",
    // flexShrink:1
    // height:70
    // flex:0.3
  },
  inputHeaderText:{
    color:colors.DARK_GRAY,
    // fontWeight:"bold",
    paddingLeft:"3%",
    fontSize:12,
    fontFamily: font.REGULAR
  },
  input:{
    fontSize:14,
    color:colors.BLACK,
    // fontWeight:"bold",
    // backgroundColor:"red"
    // height:20
    fontFamily: font.SEMI_BOLD,
  },
  inputContainer:{
    borderBottomWidth:1,
    borderBottomColor: colors.LIGHT_GRAY,
    // backgroundColor:"red",
    height:35
  },
  inputContainerFocused:{
    borderBottomWidth:1,
    borderBottomColor: colors.LIGHT_GREEN,
    // backgroundColor:"red",
    height:35
  },
  forgotPasswordView:{
    // backgroundColor:"red",
    // alignItems:"flex-end",
    // justifyContent:"flex-start",
    // width:"100%",
    paddingRight:"3%",
    marginTop:"-5%"
    
  },
  forgotPasswordText:{
    textAlign:"right",
    fontSize:12,
    // fontWeight:"bold",
    color:colors.DARK_GRAY,
    fontFamily:font.SEMI_BOLD
  },
  buttonView:{
    flex:1,
    // backgroundColor:"blue",
    width:"80%",
    justifyContent:"center",
    alignItems:"center",
  },
  loginButton:{
    backgroundColor:colors.GREEN,
    // flex:1,
    width:"100%",
    height:55,
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center"
  },
  loginText:{
    color:colors.WHITE,
    fontSize: 16,
    // fontWeight:"bold"
    fontFamily:font.BOLD,
    
  },
  bottomTextView:{
    flex:1.2,
    // backgroundColor:"red",
    width:"80%",
    justifyContent:"center",
    alignItems:"flex-end",
    flexDirection:"row",
    paddingBottom:"5%"
  },
  signupTextOne:{
    fontSize:12,
    color:colors.BLACK,
    fontFamily:font.REGULAR
  },
  signupTextTwo:{
    fontSize:12,
    color:colors.GREEN,
    // fontWeight:"bold"
    fontFamily:font.BOLD
  },
  signupButton:{

  },
  scrollView:{
    alignItems:"center",
    justifyContent:"center",
    flex:1
  },
  skipButton:{
    position:"absolute",
    top:"7%",
    right:"5%",
    // backgroundColor:"red",
    justifyContent:"center",
    alignItems:"center"
  },
  skipText:{
    fontSize:12,
    fontFamily:font.REGULAR,
    color: colors.WHITE
  }


});
