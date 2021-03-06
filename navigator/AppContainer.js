import React from 'react';
import { TouchableOpacity} from 'react-native';
import { NavigationContainer,  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/theme';
import { Icon } from "react-native-elements";
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import HomeScreen from '../screens/app/HomeScreen'
import StatsScreen from '../screens/app/StatsScreen'
import ProfileScreen from '../screens/app/ProfileScreen'
import PostScreen from '../screens/app/PostScreen'
import PostDetailScreen from '../screens/app/PostDetailScreen'
import PostingScreen from '../screens/app/PostingScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen"
      screenOptions={{
        headerShown:false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* <Stack.Screen name="PostScreen" component={PostScreen} /> */}
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}  />
    </Stack.Navigator> 
  );
}

function StatsStack() {
  return (
    <Stack.Navigator initialRouteName="StatsScreen"
      screenOptions={{
        headerShown:false,
      }}
    >
      <Stack.Screen name="StatsScreen" component={StatsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PostScreen" component={PostScreen} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}  />
    </Stack.Navigator> 
  );
}

function PostStack() {
  return (
    <Stack.Navigator initialRouteName="PostScreen"
      screenOptions={{
        headerShown:false,
      }}
    >
      <Stack.Screen name="PostScreen" component={PostScreen} />
      <Stack.Screen name="PostingScreen" component={PostingScreen}/>
      {/* <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}  />  */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator> 
  );
}





export default function AppContainer() { 
    return (
      <NavigationContainer
        // onStateChange={(x)=>console.log("----",getFocusedRouteNameFromRoute(x))}
      >
        {/* <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={DetailsScreen} />
        </Stack.Navigator> */}
        <Tab.Navigator 
          initialRouteName="HomeStack" 
          screenOptions={{
            headerShown:false,
            tabBarShowLabel:false,
            tabBarHideOnKeyboard:true,
            tabBarStyle:{
              backgroundColor: colors.WHITE,
              height:80,
              borderTopRightRadius: 35,
              borderTopLeftRadius: 35,
              // borderRadius:35,
              position:"absolute",
              bottom:0
            },
            tabBarInactiveTintColor: colors.DARK_GRAY,
            tabBarActiveTintColor: colors.GREEN,

          }}>

          <Tab.Screen name="HomeStack" component={HomeStack}
            options={({route, navigation}) => (
              {
              // tabBarBadge:10
              tabBarIcon: (tab) => {
                return (
                  <Icon
                      size={30}
                      type="feather"
                      name={"home"}
                      color={tab.focused ? colors.GREEN : colors.DARK_GRAY}
                    />
                );
              }
            }
            )}
            
          />
          <Tab.Screen name="+" component={PostStack} 
            options={({route}) => (
              {
              // tabBarBadge:10
              tabBarButton: props => 
                  <TouchableOpacity {...props}
                    // onPress={()=>console.log("HEYYYY ", props)}
                    style={{
                      backgroundColor:colors.GREEN,
                      aspectRatio:1/1,
                      // position:"absolute",
                      height: 80,
                      // top:"-50%",
                      borderRadius:1000,
                      alignItems:"center",
                      justifyContent:"center"
                    }}> 
                      <Icon
                        size={30}
                        type="feather"
                        name={"plus"}
                        color={colors.WHITE}
                      />
                  </TouchableOpacity>
              ,
              tabBarStyle: {position:"absolute", bottom:"-200%"}
              
            }
            )
          }
          />
          <Tab.Screen name="Statistics" component={StatsStack} 
            options={{
              // tabBarBadge:10
              tabBarIcon: (tab) => {
                return (
                  <Icon
                      size={30}
                      type="feather"
                      name={"bar-chart-2"}
                      color={tab.focused ? colors.GREEN : colors.DARK_GRAY}
                    />
                );
              },
              tabBarVisible: false
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
}