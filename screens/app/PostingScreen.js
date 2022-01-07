import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Platform} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import db from '../../db';
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PostingScreen({ route, navigation }) {
  const { type } = route.params;
  const [modalVisible, setModalVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [count, setCount] = useState(1)
  const [solarType, setSolarType] = useState("charge")
  const [image, setImage] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState({id:1, name:"Home"})
  const [postButtonDisabled, setPostButtonDisabled] = useState(false)
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: "Home",
      iconName: "home",
      iconType: "feather"
    },
    {
      id: 2,
      name: "Work",
      iconName: "office-building",
      iconType: "material-community"
    },
    {
      id: 3,
      name: "Other",
      iconName: "dots-horizontal",
      iconType: "material-community"
    },
  ])
  
  useEffect(() => {
    getUser()
    console.log("typeeeeeeeee ",type)
  }, []);

  const getUser = async () => {
    const snapshot = await db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
    if(snapshot.val()){
      setUser(snapshot.val())
      console.log("USER SET", snapshot.val())
    }
  };


  const commitPost = async () => {
    setPostButtonDisabled(true)
    let imageURL = null;
    if(image){
      imageURL = await uploadImage()
    }

    try {
      db.ref(`posts`).push({
        user: user,
        userId: firebase.auth().currentUser.uid,
        dateTime: new Date().toString(),
        location: selectedLocation.name,
        type:type.type,
        amount: count,
        imageURL: imageURL,
        likeCount: 0,
        solarType: solarType,
        sentence: getSentence()
        // likes: {
        //   userId: firebase.auth().currentUser.uid,
        // },
        // comments:{
        //   userId:firebase.auth().currentUser.uid,
        //   dateTime: new Date().toString(),
        //   comment: "Hey bOI"
        // }
      });
      showSuccessMessage("Posted Successfully!");
      setPostButtonDisabled(false)
      navigation.goBack()
    } catch (error) {
      // if (error.code === "auth/email-already-in-use") {
      //   showErrorMessage("That email address is already in use!")
      // }
      // if (error.code === "auth/invalid-email") {
      //   showErrorMessage("That email address is invalid!")
      // }
      console.log("Error: ", error.code)
      console.log("message: ", error.message)
      showErrorMessage(error.message)
      setPostButtonDisabled(false)
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

  const getSentence = () => {
    let userData = user.fullname.split(" ")[0];
    let typeName = type.type;

    switch(typeName) {
      case "Plant":
        return `${userData} has planted ${count} trees`

      case "Food":
        return `${userData} consumed environment friendly food`

      case "Carpool":
        return `${userData} carpooled and saved the environment`   

      case "Paperless":
        return `${userData} went paperless and saved some trees`

      case "Public Transport":
        return `${userData} travelled using public transport`

      case "Natural Clothing":
        return `${userData} bought ${count} eco-friendly clothes`

      case "Solar Energy":
        if(post.solarType === "charge"){
          return `${userData} charged using solar energy`;
        } else{
          return `${userData} installed solar panels`
        }
      default:
        return `${userData} has help us go green`
    }

  };

  const handleCounter = (action) => {
    let tempCount = count;
    if(action === "plus"){
      tempCount += 1;
    } else if(action === "minus" && tempCount > 1){
      tempCount -= 1;
    }
    setCount(tempCount)
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("RES",result);
      setImage(result.uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    console.log("RES",result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log(result.uri);
    }
  }

  const uploadImage = async () => {
    const  uri  = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      
      const putResult = await firebase
        .storage()
        .ref()
        .child(filename)
        .put(blob);

      const url = await firebase
        .storage()
        .ref()
        .child(filename)
        .getDownloadURL();

      return url;
    } catch (error) {
      console.log("Upload Error ", error)
      return null;
    }
   
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <Icon
            name={"arrow-left"}
            size={25}
            color={colors.GREEN}
            type="feather"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Please tell us more about it 
        </Text>
      </View>
      <View style={styles.body}>
        <ScrollView style={styles.scrollView}>
          {type && (type.id === 1 || type.id === 6) &&
          <View style={styles.section}>
            {type.id === 1 ?
            <Text style={styles.sectionHeaderText}>How many trees did you plant?</Text>
              :
            <Text style={styles.sectionHeaderText}>How many eco-friendly clothes did you buy?</Text>
            }
            <View style={styles.sectionBody}>
              <View style={styles.counterView}>
                <Text style={styles.countText}>{count}</Text>
              </View>
              <TouchableOpacity onPress={()=>handleCounter("minus")} style={styles.countButton}>
                <Icon
                  size={20}
                  type={"feather"}
                  name={"minus"}
                  color={colors.WHITE}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleCounter("plus")}  style={styles.countButton}>
                <Icon
                  size={20}
                  type={"feather"}
                  name={"plus"}
                  color={colors.WHITE}
                />
              </TouchableOpacity>
            </View>
          </View>
          }
          {type && type.id === 7 &&
          <View style={styles.section}>
            <Text style={styles.sectionHeaderText}>What did you do?</Text>
            <View style={styles.sectionBody}>
              <TouchableOpacity onPress={()=>setSolarType("charge")} style={solarType==="charge"?styles.whereButton : styles.inactiveWhereButton}>
                <Icon
                  size={20}
                  type={"simple-line-icon"}
                  name={"energy"}
                  color={solarType==="charge"?colors.WHITE : colors.GREEN}
                />
                <Text style={solarType==="charge"?styles.whereButtonText : styles.inactiveWhereButtonText}>Charge Device</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setSolarType("install")} style={solarType==="install"?styles.whereButton : styles.inactiveWhereButton}>
                <Icon
                  size={20}
                  type={"material-community"}
                  name={"solar-panel"}
                  color={solarType==="install"?colors.WHITE : colors.GREEN}
                />
                <Text style={solarType==="install"?styles.whereButtonText : styles.inactiveWhereButtonText}>Install Panel</Text>
              </TouchableOpacity>
            </View>
          </View>}
          <View style={styles.section}>
            <Text style={styles.sectionHeaderText}>Where?</Text>
            <View style={styles.sectionBody}>
              {locations?.map((item) =>
                <TouchableOpacity key={item.id} onPress={()=>setSelectedLocation(item)} style={selectedLocation.id === item.id ? styles.whereButton : styles.inactiveWhereButton }>
                  <Icon
                    size={20}
                    type={item.iconType}
                    name={item.iconName}
                    color={selectedLocation.id === item.id ? colors.WHITE : colors.GREEN}
                  />
                  <Text style={selectedLocation.id === item.id ? styles.whereButtonText : styles.inactiveWhereButtonText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeaderText}>Add an image</Text>
            {image ? 
            <View style={styles.sectionBodyImage}>
              <TouchableOpacity onPress={pickImage}>
                <Image source={{uri: image}} style={styles.imageStyle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setImage(null)} style={styles.imageCancel}>
                <Icon
                  size={20}
                  type={"ant-design"}
                  name={"close"}
                  color={colors.GREEN}
                />
              </TouchableOpacity>
            </View>
            :
            <View style={styles.sectionBody}>
              <TouchableOpacity onPress={openCamera} style={styles.pictureButton}>
                <Icon
                  size={20}
                  type={"feather"}
                  name={"camera"}
                  color={colors.WHITE}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImage} style={styles.pictureButton}>
                <Icon
                  size={20}
                  type={"simple-line-icon"}
                  name={"picture"}
                  color={colors.WHITE}
                />
              </TouchableOpacity>
              
            </View>
            }
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={()=>commitPost()} disabled={postButtonDisabled || user === null} style={styles.postButton}>
          <Text style={styles.postText}>POST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // height:"100%",
    backgroundColor:colors.GRAY,
    padding:"5%"
  },
  header:{
    flex:1.1,
    // backgroundColor: "red",
    justifyContent:"flex-end",
    alignItems:"flex-start"
  },
  body:{
    flex:3.3,
    // backgroundColor: "blue",
    
    // flexDirection:"row",
    // flexWrap:"wrap"
  },
  scrollView:{
    // flex:3.3,
    // backgroundColor: "red",
    marginTop: "5%"
    // flexDirection:"row",
    // flexWrap:"wrap"
  },
  section:{
    // backgroundColor:"yellow",
    paddingBottom:"15%"
  },
  sectionHeaderText:{
    fontFamily:font.REGULAR,
    fontSize:16,
    color: colors.BLACK,
    // backgroundColor:"red",
    marginBottom:"2%"
  },
  countText:{
    fontFamily:font.SEMI_BOLD,
    fontSize:16,
    color: colors.BLACK,
    // backgroundColor:"red",
  },
  sectionBody:{
    // backgroundColor:"green",
    flexDirection:"row",
    // justifyContent:"center",
    alignItems:"center"
  },
  sectionBodyImage:{
    // backgroundColor:"green",
    flexDirection:"row",
    // justifyContent:"center",
    // alignItems:"center"
  },
  imageCancel:{
    marginLeft:10
  },
  counterView:{
    backgroundColor: colors.WHITE,
    width:60,
    height:60,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:5,
    // marginRight:"5%",
    // marginLeft:"5%"
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  countButton:{
    backgroundColor:colors.GREEN,
    width:45,
    height:45,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:100,
    // marginRight:"5%",
    marginLeft:"5%"
  },
  inactiveWhereButton:{
    backgroundColor: colors.WHITE,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    // padding:"2%"
    height:60,
    width:"25%",
    minWidth:95,
    borderRadius:15,
    marginRight:"3%",
    padding:5,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  whereButton:{
    backgroundColor: colors.GREEN,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    // padding:"2%"
    height:60,
    width:"25%",
    minWidth:95,
    borderRadius:15,
    marginRight:"3%",
    padding:5,
    
  },
  pictureButton:{
    backgroundColor:colors.GREEN,
    width:65,
    height:65,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:100,
    marginRight:"4%"
    
  },
  inactiveWhereButtonText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.BLACK,
    // backgroundColor:"red",
    paddingLeft:"5%",
    textAlign:"center"
  },
  whereButtonText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.WHITE,
    // backgroundColor:"red",
    paddingLeft:"5%",
    textAlign:"center"
  },
  footer:{
    flex:0.5,
    // backgroundColor: "red",
    justifyContent:"center",
    alignItems:"center"
  },
  headerText:{
    fontFamily:font.REGULAR,
    fontSize:36,
    color: colors.BLACK,
    // paddingTop: "5%"
  },
  headerTextBold:{
    fontFamily:font.REGULAR,
    fontSize:36,
    color: colors.GREEN
  },
  typeContainer:{
    marginTop:"5%",
    // marginRight: "5%",
    width:"25%",
    // backgroundColor:"yellow",
    // justifyContent:"center",
    alignItems:"center"
  },
  typeIcon:{
    height: 65,
    width: 65,
    // width: "20%",
    aspectRatio:1/1,
    backgroundColor: colors.GREEN,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:120,
    
  },
  typeText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.BLACK,
    // backgroundColor:"red",
    width:"90%",
    textAlign:"center",
    paddingTop:5

  },
  postButton:{
    width:"100%",
    height:55,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:colors.GREEN,
    borderRadius: 15
  },
  postText:{
    fontFamily:font.SEMI_BOLD,
    fontSize:18,
    color: colors.WHITE
  },
  modal:{
    backgroundColor:colors.WHITE,
    height: "20%",
    width: "80%",
    position:"absolute",
    top: "42%",
    alignSelf:"center",
    borderRadius:10,
    padding:"4%"
    // justifyContent:"center",
    
  },
  modalHeader:{
    // backgroundColor:"blue",
    minHeight:"20%",
    justifyContent:"center",
    alignItems:"flex-end"
  },
  modalBody:{
    // backgroundColor:"yellow",
    height:"80%",
    padding:"4%",
    paddingTop: 0
  },
  modalTitleText:{
    fontFamily:font.SEMI_BOLD,
    fontSize:14,
    color: colors.BLACK
  },
  modalDescText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.DARK_GRAY
  },
  imageStyle:{
    height:100,
    width: 100,
    resizeMode:"cover"
  }
});
