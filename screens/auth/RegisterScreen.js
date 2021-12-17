import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, LogBox, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import db from '../../db';
import { showMessage } from "react-native-flash-message";

export default function RegisterScreen({ navigation }) {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [phone, setPhone] = useState("")

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

  const validate = () => {
    if(fullname.length === 0){
      showErrorMessage("Name cannot be empty")
      return false;
    }
    if (email.length === 0 || password.length === 0) {
      showErrorMessage("Email and Password cannot be empty")
      return false;
    }
    if (!new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$").test(password)){
      showErrorMessage("Enter a strong Password")
      return false;
    }
    if (password !== confirmPassword) {
      showErrorMessage("Password does not match")
      return false;
    }
    signUp();
  };

  const signUp = async () => {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        db.ref(`users/${firebase.auth().currentUser.uid}`).set({
          id: firebase.auth().currentUser.uid,
          fullname: fullname,
          email: email,
          phone: phone
        });
        showSuccessMessage("Successful Sign Up");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          showErrorMessage("That email address is already in use!")
        }
        if (error.code === "auth/invalid-email") {
          showErrorMessage("That email address is invalid!")
        }
      }
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" && "padding"}>
      <View style={styles.containerBottom}>
      <View style={styles.containerLeft}></View>
      <View style={styles.containerRight}></View>
      </View>
      
      <View style={styles.containerTop}>
        <View style={styles.top}>
          <View style={styles.topLeftView}>
            <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.topHeadingButton}>
              <Icon
                name={"arrow-left"}
                size={25}
                color={colors.GREEN}
                type="feather"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.topHeadingView}>
            <Text style={styles.topHeadingText}>Register</Text>
          </View>
          <View style={styles.topLeftView}>
          </View>
        </View>
        <View style={styles.bottom}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {!isKeyboardVisible && <View style={{flex:0.5}}></View>}
            <View style={styles.inputView}>
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Full Name</Text>
                <Input 
                  placeholder='Tom Holland'
                  onChangeText={(x)=> setFullname(x)}
                  value={fullname}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  // errorStyle={}
                  
                />
              </View>
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Email Address</Text>
                <Input 
                  placeholder='tom@example.com'
                  onChangeText={(x)=> setEmail(x)}
                  value={email}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  // errorStyle={}
                  
                />
              </View>
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Phone</Text>
                <Input 
                  placeholder='+974 3333 4444'
                  onChangeText={(x)=> setPhone(x)}
                  value={phone}
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
              </View>   
              <View style={styles.singleInputView}>
                <Text style={styles.inputHeaderText}>Confirm Password</Text>
                <Input 
                  placeholder="*********" 
                  secureTextEntry={!passwordVisible}
                  onChangeText={(x)=> setConfirmPassword(x)}
                  value={confirmPassword}
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
              </View>  
            </View>
            {!isKeyboardVisible && 
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={()=> validate()} style={styles.loginButton}>
                <Text style={styles.loginText}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
            }
          </ScrollView>
        </View>
      </View>
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
    // justifyContent:"center",
    alignItems:"center",
    flexDirection:"row"
  },
  topLeftView:{
    // backgroundColor:"red",
    flex:1,
    alignItems:"center",
    justifyContent: 'center',
  },
  topHeadingButton:{
    backgroundColor:colors.WHITE,
    height:45,
    width:45,
    borderRadius:100,
    alignItems:"center",
    justifyContent: 'center',
  },
  topHeadingView:{
    // backgroundColor:"blue",
    flex:3,
    alignItems:"center"
  },
  topHeadingText:{
    fontSize:18,
    fontFamily:font.SEMI_BOLD,
    color: colors.WHITE
  },
  bottom:{
    flex:4,
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
