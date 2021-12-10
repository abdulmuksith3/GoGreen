import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, LogBox, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';

export default function ForgotScreen({ navigation }) {
  const [email, setEmail] = useState("")

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
            <Text style={styles.topHeadingText}>Forgot Password</Text>
          </View>
          <View style={styles.topLeftView}>
          </View>
        </View>
        <View style={styles.bottom}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.inputView}>
              <View style={styles.helperTextView}><Text style={styles.helperText}>Enter the email address linked to your account to recover the password</Text></View>
              <View style={styles.singleInputView}>
                {/* <Text style={styles.inputHeaderText}>Email Address</Text> */}
                <Input 
                  placeholder='Your email address'
                  onChangeText={(x)=> setEmail(x)}
                  value={email}
                  inputStyle={styles.input}
                  inputContainerStyle={styles.inputContainer}
                  // errorStyle={}
                />
              </View>
            </View>
            {/* {!isKeyboardVisible &&  */}
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={()=> console.log("RECOVER - ",email)} style={styles.loginButton}>
                <Text style={styles.loginText}>RECOVER</Text>
              </TouchableOpacity>
            </View>
            {/* // } */}
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
    flex:1,
    width:"80%",
    justifyContent:"center",
    // alignItems:"center",
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
    // justifyContent:"center",
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
  },
  helperTextView:{
    // backgroundColor:"red",
    marginBottom:50
  },
  helperText:{
    fontSize:16,
    fontFamily:font.REGULAR,
    color: colors.BLACK
  }


});
