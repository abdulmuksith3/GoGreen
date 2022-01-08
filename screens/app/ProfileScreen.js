import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {colors, font} from '../../theme/theme';
import { Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import db from '../../db';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';


export default function ProfileScreen({ route, navigation }) {
  const { user, currentUser } = route.params;
  const [image, setImage] = useState(null)
  const [history, setHistory] = useState([])
  
  useEffect(() => {
    getHistory()
  }, []);

  const getHistory = async () => {
    // console.log("GETTING POSTS")
    try {
      db.ref('posts/').orderByChild("userId").equalTo(user.id).once('value', (snapshot) => {
        let history = [];
        snapshot.forEach((childSnapshot) => {              
          let temp = childSnapshot.val();
          temp.id = childSnapshot.key;
          // console.log("TEMP ", temp)
          history.push(temp)  
        })

        setHistory(history.reverse())
        // console.log("HISTORYYY", history)
      });
      
    } catch (error) {
      console.log("NOPE ", error)
    }
  };

  const getSentence = (item) => {
    let userData = "You";

    switch(item.type) {
      case "Plant":
        return `${userData} planted ${item.amount} trees`

      case "Food":
        return `${userData} consumed environment friendly food`

      case "Carpool":
        return `${userData} carpooled and saved the environment`   

      case "Paperless":
        return `${userData} went paperless and saved some trees`

      case "Public Transport":
        return `${userData} travelled using public transport`

      case "Natural Clothing":
        return `${userData} bought ${item.amount} eco-friendly clothes`

      case "Solar Energy":
        if(item.solarType === "charge"){
          return `${userData} charged using solar energy`;
        } else{
          return `${userData} installed solar panels`
        }
      default:
        return `${userData} helped us go green`
    }

  };

  const getIcon = (type) => {
    let iconName ="";
    let iconType ="";

    switch(type) {
      case "Plant":
        iconName = "tree";
        iconType = "entypo";
        break; 

      case "Food":
        iconName = "no-food";
        iconType = "material";
        break;

      case "Carpool":
        iconName = "slideshare";
        iconType = "entypo";
        break;    

      case "Paperless":
        iconName = "print-disabled";
        iconType = "material";
        break; 

      case "Public Transport":
        iconName = "train";
        iconType = "material";
        break; 

      case "Natural Clothing":
        iconName = "shirt";
        iconType = "ionicon";
        break;

      case "Solar Energy":
        iconName = "solar-panel";
        iconType = "material-community";
        break;
    }

    return (
      <Icon
        size={20}
        type={iconType}
        name={iconName}
        color={colors.WHITE}
      />
    )

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
      commitPost(result.uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // console.log("RES",result);

    if (!result.cancelled) {
      commitPost(result.uri);
    }
  }

  const uploadImage = async (image) => {
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

  const commitPost = async (image) => {
    let imageURL = null;
    if(image){
      imageURL = await uploadImage(image)
    }

    try {
      db.ref(`users/${firebase.auth().currentUser.uid}`).update({photoURL:imageURL});
      setImage(imageURL)
      showSuccessMessage("Uploaded Successfully!");
    } catch (error) {

      console.log("Error: ", error.code)
      console.log("message: ", error.message)
      showErrorMessage(error.message)
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
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Icon
                name={"arrow-left"}
                size={25}
                color={colors.WHITE}
                type="feather"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> firebase.auth().signOut()}>
              <Icon
                name={"logout"}
                size={25}
                color={colors.WHITE}
                type="father"
              />
            </TouchableOpacity>
          </View>
          {(user?.photoURL || image )?
            <TouchableOpacity style={styles.headerButton} onPress={pickImage} onLongPress={openCamera} disabled={user.id !== firebase.auth().currentUser.uid}>
              <Image source={{uri: image ? image : user.photoURL}} style={styles.profilePic} />
            </TouchableOpacity>
            :            
            <TouchableOpacity style={styles.headerButton} onPress={pickImage} onLongPress={openCamera} disabled={user.id !== firebase.auth().currentUser.uid}>
              <Icon
                size={30}
                type="feather"
                name={"user"}
                color={colors.GREEN}
              />
            </TouchableOpacity>
          }
          <Text style={styles.nameText}>{user?.fullname}</Text> 
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContainer}>
            <Text style={styles.histText}>History</Text>
            <ScrollView style={styles.scrollView}>
              {history?.length > 0 ? history.map((item, index) => 
                <TouchableOpacity key={index} onPress={()=>navigation.navigate("PostDetailScreen", {post:item, user:currentUser})}   style={styles.histContainer}>
                  <View style={styles.histLeft}>
                    <View style={styles.typeIcon}>
                      {/* <Icon
                        size={22}
                        type={"entypo"}
                        name={"tree"}
                        color={colors.WHITE}
                      /> */}
                      {getIcon(item.type)}
                    </View>
                  </View>
                  <View style={styles.histCenter}>
                    {user.id === currentUser.id ?
                    <Text style={styles.activityText}>{getSentence(item)}</Text>
                    :
                    <Text style={styles.activityText}>{item.sentence}</Text>
                    }
                  </View>
                  <View style={styles.histRight}>
                    <Text style={styles.dateText}>{item.dateTime && moment(item.dateTime).format('MM/DD')}</Text>
                  </View>
                </TouchableOpacity>
              )
              :
                <View style={styles.noHistoryView}>
                  <Text style={styles.noHistoryText}>There is no history</Text>
                </View>
              }
              
            </ScrollView>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.GRAY
  },
  header:{
    flex:1,
    backgroundColor:colors.GREEN,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems:"center",
    justifyContent:"center"
  },
  body:{
    flex:1.5,
    backgroundColor:colors.GRAY,
    // padding:"5%"
  },
  headerTop:{
    // backgroundColor:"red", 
    width:"90%", 
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  bodyContainer:{
    flex:1,
    // backgroundColor:"yellow",
    margin:"4%",
    marginTop:"6%"
    // padding:"5%"
  },
  scrollView:{
    // backgroundColor:"blue",
    flex:1
  },
  headerButton:{
    backgroundColor: colors.WHITE,
    height:95,
    width:95,
    borderRadius:100,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:"5%"
    // flex:1
    // aspectRatio:1/1
  },
  profilePic:{
    height:95,
    width:95,
    borderRadius:100,
    resizeMode:"cover"
  },
  nameText:{
    fontFamily:font.REGULAR,
    fontSize:24,
    color: colors.WHITE
  },
  emailText:{
    fontFamily:font.THIN,
    fontSize:16,
    color: colors.WHITE
  }, 
  histText:{
    fontFamily:font.REGULAR,
    fontSize:22,
    color: colors.BLACK
  }, 
  histContainer:{
    // backgroundColor:"yellow",
    height:55,
    flexDirection:"row",
    marginTop:"3%"
  }, 
  histLeft:{
    // backgroundColor:"green",
    flex:1.1,
    justifyContent:"center"
  }, 
  histCenter:{
    // backgroundColor:"red",
    flex:4,
    justifyContent:"center"
  }, 
  histRight:{
    // backgroundColor:"green",
    flex:1,
    justifyContent:"center",
    alignItems:"flex-end"
  },
  typeIcon:{
    height: 50,
    width: 50,
    aspectRatio:1/1,
    backgroundColor: colors.GREEN,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:120,
  },
  activityText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.BLACK
  },
  dateText:{
    fontFamily:font.REGULAR,
    fontSize:12,
    color: colors.DARK_GRAY
  },
  noHistoryView:{
    alignItems:"center",
    justifyContent:"center",
    height:200
  },
  noHistoryText:{
    fontFamily:font.REGULAR,
    fontSize:16,
    color: colors.DARK_GRAY
  }
});
