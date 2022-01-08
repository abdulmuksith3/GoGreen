import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableOpacity, Modal} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
// import { showMessage } from "react-native-flash-message";
// import db from '../../db';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PostScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [details, setDetails] = useState(null)
  const [types, setTypes] = useState([
    {
      id:1,
      type: "Plant",
      description: "Did you plant a tree today?",
      iconName: "tree",
      iconType: "entypo"
    },
    {
      id:2,
      type: "Food",
      description: "Did you avoid food wasteage or eat less meat or avoid processed foods with wasteful packaging?",
      iconName: "no-food",
      iconType: "material"
    },
    {
      id:3,
      type: "Carpool",
      description: "Did you share a car or taxi with another person instead of going alone?",
      iconName: "slideshare",
      iconType: "entypo"
    },
    {
      id:4,
      type: "Paperless",
      description: "Did you avoid printing on paper at work or home?",
      iconName: "print-disabled",
      iconType: "material"
    },
    {
      id:5,
      type: "Public Transport",
      description: "Did you use the public transport as your mode of travel today?",
      iconName: "train",
      iconType: "material"
    },
    {
      id:6,
      type: "Natural Clothing",
      description: "Did you avoid synthetic clothing and buy cotton or other naturally made fabric?",
      iconName: "shirt",
      iconType: "ionicon"
    },
    {
      id:7,
      type: "Solar Energy",
      description: "Did you use solar energy to charge your electronics? or did you install a solar panel or solar water heater?",
      iconName: "solar-panel",
      iconType: "material-community"
    },
  ])

  useEffect(() => {
    // console.log(navigation, "---")
    // navigation.navigate("PostDetailScreen")
  }, []);


  const handleModal = (item) => {
    setDetails(item)
    setModalVisible(true)
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
          How did you contribute to the <Text style={styles.headerTextBold}>GoGreen</Text> cause today?
        </Text>
      </View>
      <View style={styles.body}>
        {types?.length > 0 && types.map((item, index) =>
          <TouchableOpacity key={index} onPress={()=>navigation.navigate("PostingScreen", {type:item})} onLongPress={()=>handleModal(item)} style={styles.typeContainer}>
            <View style={styles.typeIcon}>
              <Icon
                size={28}
                type={item.iconType}
                name={item.iconName}
                color={colors.WHITE}
              />
            </View>
            <Text style={styles.typeText}>{item.type}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.hintText}>Help: Hold each type to learn more</Text>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={()=>setModalVisible(false)}>
              <Icon
                size={24}
                type={"ant-design"}
                name={"close"}
                color={colors.GREEN}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.modalTitleText}>{details?.type}</Text>
            <Text style={styles.modalDescText}>{details?.description}</Text>
          </View>
        </View>
      </Modal>
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
    flex:3,
    // backgroundColor: "red",
    justifyContent:"space-evenly",
    alignItems:"flex-start"
  },
  body:{
    flex:3.3,
    // backgroundColor: "blue",
    flexDirection:"row",
    flexWrap:"wrap"
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
    color: colors.BLACK
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
  hintText:{
    fontFamily:font.REGULAR,
    fontSize:14,
    color: colors.DARK_GRAY
  },
  modal:{
    backgroundColor:colors.WHITE,
    height: "20%",
    width: "80%",
    position:"absolute",
    top: "42%",
    alignSelf:"center",
    borderRadius:10,
    padding:"4%",
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
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
  }
});
