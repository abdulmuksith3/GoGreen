import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image} from 'react-native';
import {colors, font} from '../../theme/theme';
import {Input, Icon} from 'react-native-elements';
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { showMessage } from "react-native-flash-message";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import db from '../../db';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const data = {
  // labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      strokeWidth: 2 
    }
  ],
  legend: ["Pollution"]
};

const chartConfig = {
  backgroundGradientFrom: colors.GREEN,
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: colors.GREEN,
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional,
  
};

const ringData = {
  labels: ["Plant", "Food", "Carpool","Paperless", "Transport", "Clothing", "Solar"],
  data: [0, 0, 0, 0, 0, 0, 0]
};
const API_KEY = 'bd01cba6-5f69-4193-b340-1bc2ce97e25d'
const CITY = "Hertford";
const STATE = "England";
const COUNTRY = "United Kingdom";

export default function StatsScreen({ navigation }) {
  const [activity, setActivity] = useState(null)
  const [pollution, setPollution] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
    getActivity()
    fetchAPI()
  }, []);

  const fetchAPI = async (userId) => {

    try {
      let url = `http://api.airvisual.com/v2/city?city=${CITY}&state=${STATE}&country=${COUNTRY}&key=${API_KEY}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token':'eyJhbGciOiJIUzI1NiJ9.NzZiYTMxYTAtNmZmNC0xMWVjLTk1MDYtNTE4YTRjNDVlNzY3.l0bHwLdXH8nCirJDprY6_jLZ_NUPxR5TGe8xsKQWE8M'
        },
        // body: JSON.stringify(data)
      })
      let res = await response.json()
      handlePollutionData(res)
      // console.log("fetchAPI ",res)
    } catch (err) {
      console.log("fetchAPI Errror ",err.message)
    }
  }

  const handlePollutionData = (item) => {
    // console.log("HADN")
    const pollution = item.data.current.pollution
    const weather = item.data.current.weather

    let labels = ["aqicn", "aqius", "hu", "tp", "ws"];
    let datasets = [{
        data: [pollution.aqicn, pollution.aqius, weather.hu, weather.tp, weather.ws],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2 
      }]
    let legend=["Pollution"]

    setPollution({labels, datasets, legend})

  };

  const getUser = async () => {
    const snapshot = await db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
    if(snapshot.val()){
      setUser(snapshot.val())
      // console.log("USER SET", snapshot.val())
    }
  };

  const getActivity = async () => {
    try {
      db.ref('posts/').orderByChild("userId").equalTo(firebase.auth().currentUser.uid).once('value', (snapshot) => {
        let plant = 0;
        let food = 0;
        let carpool = 0;
        let paperless = 0;
        let publicTransport = 0;
        let clothing = 0;
        let solar = 0;
        let total = 0;

        snapshot.forEach((childSnapshot) => {              
          let temp = childSnapshot.val();
          temp.id = childSnapshot.key;
          
          switch(temp.type) {
            case "Plant":
              plant += 1;
              total +=1;
              break;
            case "Food":
              food += 1;
              total +=1;
              break;
            case "Carpool":
              carpool += 1;
              total +=1;
              break;
            case "Paperless":
              paperless += 1;
              total +=1;
              break;
            case "Public Transport":
              publicTransport += 1;
              total +=1;
              break;
            case "Natural Clothing":
              clothing += 1;
              total +=1;
              break;
            case "Solar Energy":
              solar += 1;
              total +=1;
              break;
          }
        })
        const data = [
          plant/total, 
          food/total, 
          carpool/total, 
          paperless/total,
          publicTransport/total,
          clothing/total,
          solar/total,]
        setActivity(data)
      });
      
    } catch (error) {
      console.log("NOPE ", error)
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height:windowHeight/20}}></View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Your <Text style={styles.headerTextBold}>Statistics</Text> </Text> 
          </View>
          {/* <View style={styles.headerRight}>
            {user?.photoURL ?
            <TouchableOpacity style={styles.headerButton} onPress={()=>navigation.navigate("ProfileScreen", {user: user, currentUser: user})}>
              <Image source={{uri: user.photoURL}} style={styles.profilePic} />
            </TouchableOpacity>

            :            
            <TouchableOpacity style={styles.headerButton} onPress={()=>navigation.navigate("ProfileScreen", {user: user, currentUser: user})}>
              <Icon
                size={30}
                type="feather"
                name={"user"}
                color={colors.WHITE}
              />
            </TouchableOpacity>
            }   
          </View> */}
        </View>
        <View style={styles.section}>     
          <Text style={styles.sectionHeaderText}>Activity</Text>   
          <ProgressChart
            data={{
              labels: ringData.labels,
              data: activity ? activity : ringData.data
            }}
            width={windowWidth/1.1}
            height={windowHeight/3}
            strokeWidth={8}
            radius={25}
            chartConfig={chartConfig}
            hideLegend={false}
            style={{borderRadius:30}}
          />
        </View>
        <View style={styles.section}>     
          <Text style={styles.sectionHeaderText}>Air Quality</Text>   
          <LineChart
            data={pollution ? pollution : data}
            width={windowWidth/1.1}
            height={windowHeight/3}
            verticalLabelRotation={30}
            chartConfig={chartConfig}
            bezier
            style={{borderRadius:30}}
          />
        </View>
        <View style={{height:windowHeight/8}}>

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
    backgroundColor:colors.GRAY,
    alignItems:"center"
  },
  section:{
    // backgroundColor:"red",
    flex:1,
    width:"80%",
    marginBottom:"10%"
    // alignItems:"center"
  },
  sectionHeaderText:{
    // backgroundColor:"red",
    fontFamily:font.REGULAR,
    fontSize:28,
    color: colors.BLACK,
    marginBottom:"3%"

  },
  header:{
    // backgroundColor:colors.GRAY,
    // flex:1,
    height:windowHeight/6,
    // flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center"
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
    fontSize:28,
    // paddingLeft:"7%",
    color: colors.BLACK,
  },
  headerTextBold:{
    // fontFamily:font.THIN,
    fontSize:28,
    color: colors.GREEN
  },
  profilePic:{
    height:65,
    width:65,
    borderRadius:100,
    resizeMode:"cover"
  },
});
