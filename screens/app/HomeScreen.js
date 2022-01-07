import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon, Header} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import db from '../../db';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPosts()
  }, []);

  const getPosts = async () => {
    console.log("GETTING POSTS")
    try {
      let posts = [];
      db.ref('posts/').once('value', (snapshot) => {
        snapshot.forEach(async (childSnapshot) => {              
          let post = childSnapshot.val();
          post.id = childSnapshot.key;
          console.log("SNAPPPP ", post)
          // let snap = await db.ref(`users/${post.userId}`).once('value');
          // if(snap.val()){
          //   console.log("SNAPPPP ", snap.val())
          //   post.user = snap.val()
          // }
          posts.push(post)  
      })});
      setPosts(posts)
      console.log("GOT", posts)
    } catch (error) {
      console.log("NOPE ", error)
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{height:windowHeight/20}}></View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Hi, Abdul</Text> 
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton} onPress={()=>navigation.navigate("ProfileScreen")}>
              <Icon
                size={30}
                type="feather"
                name={"user"}
                color={colors.WHITE}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          {posts?.length > 0 ? posts.map( (item, index) =>
            <TouchableOpacity key={index} style={[styles.postContainer, {marginTop: index === 0 ? 0:10}]} onPress={()=>navigation.navigate("PostDetailScreen")} activeOpacity={1}>
              <View style={styles.postDetailsView}>
                <View style={styles.postDetailsLeft}>
                  <TouchableOpacity style={styles.postUserBtn} onPress={()=>console.log("UserId", item.userId)}>
                    <Icon
                      size={30}
                      type="feather"
                      name={"user"}
                      color={colors.WHITE}
                    />
                  </TouchableOpacity>
                  
                </View>
                <View style={styles.postDetailsCenter}>
                  <Text style={styles.postTextOne}>Alice planted 2 trees</Text>
                  <Text style={styles.postTextTwo}>{item.dateTime && item.dateTime} {item.location && " at "} {item.location && item.location}</Text>
                </View>
                <View style={styles.postDetailsRight}>
                  <Text style={styles.likeCountLiked}>{item.likeCount ? item.likeCount : 0}</Text>
                  <TouchableOpacity onPress={()=>console.log("LIKE")} style={styles.likeBtn}>
                    <Icon
                      size={29}
                      type="feather"
                      name={"heart"}
                      color={colors.GREEN}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {item && item.imageURL &&
                <View style={styles.postImageView}>
                  <Image
                    style={styles.postImage}
                    source={require('../../assets/pots.jpg')}
                    defaultSource={require('../../assets/loading.gif')}
                    // source={{
                    //   uri: 'https://reactnative.dev/img/tiny_logo.png',
                    // }}
                  />
                </View>
              }
            </TouchableOpacity>
          ):
          <View style={styles.noContentContainer}>
            <Text style={styles.noContentText}>There are no posts yet</Text>
          </View>
          }
          <View style={{height:windowHeight/8}}>
            {/* SCROLLVIEW EXTRA SPACE */}
          </View>
        </View>
      </ScrollView>    
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    // height:"100%",
    // justifyContent:"center",
    // alignItems:"center",
    backgroundColor:colors.GRAY
  },
  scrollContainer:{
    backgroundColor:colors.GRAY,
    // flex:1,    
  },

  header:{
    // backgroundColor:colors.GRAY,
    // flex:1,
    height:windowHeight/6,
    flexDirection:"row",
    // alignItems:"center"
  },
  headerLeft:{
    flex:3,
    // backgroundColor:"yellow",
    justifyContent:"center",
    // alignItems:"center"
  },
  headerRight:{
    flex:1,
    // backgroundColor:"blue",
    justifyContent:"center",
    alignItems:"center"
  },
  headerButton:{
    backgroundColor: colors.GREEN,
    height:65,
    width:65,
    borderRadius:100,
    justifyContent:"center",
    alignItems:"center"
    // flex:1
    // aspectRatio:1/1
  },
  headerText:{
    fontFamily:font.SEMI_BOLD,
    fontSize:24,
    paddingLeft:"7%"
  },

  
  body:{
    backgroundColor:colors.GRAY,
    // flex:3.5,
    // paddingLeft:"3%",
    // paddingRight:"3%",
    // borderTopWidth:1
  },
  postContainer:{
    // backgroundColor:"red",
    // maxHeight:300,
    borderBottomWidth:1,
    borderBottomColor:colors.LIGHT_GRAY,
    // marginTop:50
    
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
    color: colors.VERY_DARK_GRAY
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
  }
});
