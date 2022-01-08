import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Dimensions} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import db from '../../db';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PostDetailScreen({ route, navigation }) {
  const { post, user } = route.params;
  const [comments, setComments] = useState([])
  const [myComment, setMyComment] = useState("")
  const [postButtonDisabled, setPostButtonDisabled] = useState(false)
  const [allUsers, setAllUsers] = useState(null)

  useEffect(() => {
    const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: {position:"absolute", bottom:"-100%"}
      });
      return () =>
        parent.setOptions({
          tabBarStyle: {
          backgroundColor: colors.WHITE,
          height:80,
          borderTopRightRadius: 35,
          borderTopLeftRadius: 35,
          // borderRadius:35,
          position:"absolute",
          bottom:0}
        });
  }, [route]);

  useEffect(() => {
    getAllUsers()
  }, []);

  const getAllUsers = async () => {
    // console.log("GETTING POSTS")
    try {
      
      db.ref('users/').once('value', (snapshot) => {
        let posts = [];
        snapshot.forEach((childSnapshot) => {              
          let post = childSnapshot.val();
          post.id = childSnapshot.key;
          posts.push(post)  
        })
        setAllUsers(posts)
        // console.log("GOT", posts)
      });
      
    } catch (error) {
      console.log("NOPE ", error)
    }
  };

  useEffect(() => {
    // console.log("POST ", post.comments)
    if(post.comments && allUsers){
      const data = post.comments;
      const arr = Object.keys(data).map((i) => {
        const comment = data[i]
        data[i].user = allUsers.filter(x=>x.id === comment.user.id)[0]
        return data[i]
      })
      setComments(arr);    
    } else{
      setComments([])
    }
  }, [post, allUsers]);

  const commitComment = async () => {
    Keyboard.dismiss()
    setPostButtonDisabled(true)
    try {
      const data = {
        user: user,
        dateTime: new Date().toString(),
        comment: myComment
      }
      db.ref(`posts/${post.id}/comments`).push(data);
      showSuccessMessage("Posted Successfully!");
      setPostButtonDisabled(false)
      let comment = [...comments];
      comment.push(data)
      setComments(comment)
      setMyComment("")
    } catch (error) {
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

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios"&& "padding"} >
      <View style={styles.header}>
        <TouchableOpacity style={{alignSelf:"flex-start", marginLeft:"5%"}} onPress={()=> navigation.goBack()}>
          <Icon
            name={"arrow-left"}
            size={25}
            color={colors.GREEN}
            type="feather"
          />
        </TouchableOpacity>
        <View style={styles.postDetailsView}>
          <View style={styles.postDetailsLeft}>
            {post?.user?.photoURL ?
            <TouchableOpacity style={styles.postUserBtn} onPress={()=>navigation.navigate("ProfileScreen", {user: post.user, currentUser: user})}>
              <Image source={{uri: post.user.photoURL}} style={styles.profilePic} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.postUserBtn} onPress={()=>navigation.navigate("ProfileScreen", {user: post.user, currentUser: user})}>
              <Icon
              size={30}
              type="feather"
              name={"user"}
              color={colors.WHITE}
            />
            </TouchableOpacity>
          }
          </View>
          <View style={styles.postDetailsCenter}>
            <Text style={styles.postTextOne}>
              {post.sentence ? post.sentence : ""}
            </Text>
            <Text style={styles.postTextTwo}>{post.dateTime && moment(post.dateTime).format('ddd, DD MMM YY h:mm')} {post.location && "at"} {post.location && post.location}</Text>
          </View>
          <View style={styles.postDetailsRight}>
            <Text style={styles.likeCountLiked}>{post.likeCount ? post.likeCount : 0}</Text>
            <TouchableOpacity disabled={true} style={styles.likeBtn}>
              <Icon
                size={29}
                type="feather"
                name={"heart"}
                color={colors.GREEN}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.body}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            {comments?.length > 0 ? comments.map((item,index)=> 
              <View key={index} style={[styles.commentContainer, {marginTop: index === 0 ? "8%": "1%"}]}>
                <View style={styles.commentLeft}>
                {item?.user?.photoURL ?
                  <TouchableOpacity style={styles.postUserBtn} onPress={()=>navigation.navigate("ProfileScreen", {user: item.user, currentUser: user})}>
                    <Image source={{uri: item.user.photoURL}} style={styles.postProfilePic} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.postUserBtn} onPress={()=>navigation.navigate("ProfileScreen", {user: item.user, currentUser: user})}>
                    <Icon
                      size={30}
                      type="feather"
                      name={"user"}
                      color={colors.WHITE}
                    />
                  </TouchableOpacity>
                }
                </View>
                <View style={styles.commentCenter}>
                  <Text style={styles.postTextOne}>{item.user.fullname}</Text>
                  <Text style={styles.postTextThree}>{item.comment}</Text>
                </View>
                <View style={styles.commentRight}>
                  <Text style={styles.postTextTwo}>{item.dateTime && moment(item.dateTime).fromNow()}</Text>
                </View>
              </View>
              ) 
              :
              <View style={{marginTop:"10%"}}>
                <Text style={styles.postTextThree}>There no comments</Text>
              </View>
            }
            
          </ScrollView>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Input 
            placeholder='Message'
            onChangeText={(x)=> setMyComment(x)}
            value={myComment}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputContainer}
            // errorStyle={}
          />
        </View>
        <View style={styles.footerRight}>
          <TouchableOpacity style={styles.sendButton} onPress={()=>commitComment()} disabled={postButtonDisabled || myComment.length === 0} >
          <Icon
            size={22}
            type="feather"
            name={"send"}
            color={colors.WHITE}
          />
        </TouchableOpacity>
        </View>
        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.GRAY
  },
  header:{
    flex:1.8,
    // backgroundColor:"red",
    justifyContent:"flex-end",
    borderBottomWidth:1,
    borderColor: colors.LIGHT_GRAY
  },
  body:{
    flex:4.8,
    // backgroundColor:"yellow"
  },
  footer:{
    flex:1,
    backgroundColor:colors.LIGHT_GRAY,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-evenly",
  },
  footerLeft:{
    // flex:4,
    backgroundColor:colors.WHITE,
    width:"75%",
    height:"50%",
    minHeight:45,
    borderRadius:20,
    justifyContent:"center"
  },
  footerRight:{
    // flex:1,
    width:"15%",
    height:"50%",
    minHeight:45,
    // backgroundColor:"blue",
    justifyContent:"center",
    alignItems:"center"
  },
  scrollView:{
    flex:1,
    // backgroundColor:"green"
  },  
  scrollViewContent:{
    alignItems:"center"
  },  
  commentContainer:{
    minHeight:80,
    // backgroundColor:"red",
    // borderWidth:1,
    // marginTop: "2%",
    width:"100%",
    flexDirection:"row"
    // alignSelf:"center"
  },
  commentLeft:{
    flex:1.3,
    // backgroundColor:"yellow",
    alignItems:"center"
  },
  commentCenter:{
    flex:3,
    // backgroundColor:"blue"
  },
  commentRight:{
    flex:2,
    // backgroundColor:"yellow",
    alignItems:"center"
  },
  postDetailsView:{
    // flex:1,
    // backgroundColor:"yellow",
    flexDirection:"row",
    height:100
  },
  postDetailsLeft:{
    // backgroundColor:"blue",
    flex:1.3,
    justifyContent:"center",
    alignItems:"center"
  },
  postDetailsCenter:{
    // backgroundColor:"green",
    flex:3.5,
    justifyContent:"center"
  },
  postTextOne:{
    // flex:1,
    // backgroundColor:"yellow",
    fontFamily:font.SEMI_BOLD,
    fontSize:16,
    color: colors.BLACK
  },
  postTextTwo:{
    // flex:1,
    // backgroundColor:"pink",
    fontFamily:font.REGULAR,
    fontSize:12,
    color: colors.VERY_DARK_GRAY,
  },
  postTextThree:{
    // flex:1,
    // backgroundColor:"pink",
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.VERY_DARK_GRAY,
  },
  postDetailsRight:{
    // backgroundColor:"blue",
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  postImageView:{
    // borderWidth:2,
    flex:1
  },
  postImage:{
    resizeMode:'cover',
    width:windowWidth,
    height:windowHeight/4,
    // aspectRatio:1/3
    // borderBottomWidth:1,
    // borderBottomColor:colors.LIGHT_GRAY,

  },
  likeCount:{
    position:"absolute",
    color:colors.GRAY,
    fontFamily:font.REGULAR,
    fontSize:9
  },
  likeCountLiked:{
    position:"absolute",
    color:colors.GREEN,
    fontFamily:font.REGULAR,
    fontSize:9
  },
  postUserBtn:{
    backgroundColor: colors.GREEN,
    height:55,
    width:55,
    borderRadius:100,
    justifyContent:"center",
    alignItems:"center"
    // flex:1
    // aspectRatio:1/1
  },
  noContentContainer:{
    justifyContent:"center",
    alignItems:"center",
    height: windowHeight * 0.5,
    backgroundColor:colors.GRAY
    // flex:1
  },
  noContentText:{
    fontFamily:font.REGULAR,
    fontSize:16,
    color: colors.GREEN
  },
  profilePic:{
    height:65,
    width:65,
    borderRadius:100,
    resizeMode:"cover"
  },  
  postProfilePic:{
    height:55,
    width:55,
    borderRadius:100,
    resizeMode:"cover"
  },
  input:{
    fontSize:14,
    color:colors.BLACK,
    // fontWeight:"bold",
    // backgroundColor:"red"
    // height:20
    fontFamily: font.REGULAR,
  },
  inputContainer:{
    borderBottomWidth:0,
    // // borderBottomColor: colors.LIGHT_GRAY,
    // backgroundColor:colors.WHITE,
    // // padding:"2%",
    height:"100%",
    justifyContent:"center",
    // borderRadius:20,
    width:"100%"
  },
  sendButton:{
    backgroundColor: colors.GREEN,
    borderRadius:120,
    padding:"3%",
    height:"100%",
    aspectRatio:1/1,
    justifyContent:"center",
    alignItems:"center",
    // height:45,
    // width:45
  }
});
