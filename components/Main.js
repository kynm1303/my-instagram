import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native';
import { Provider, useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { userSelector } from '../redux/selector';
import store from '../redux/store';
import userSlice from '../redux/userSlice';
import { getAuth, signOut } from 'firebase/auth';
import * as firebase from 'firebase';
require('firebase/firestore')
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/post/Feed';
import ProfileScreen from './main/profile/Profile';
import SearchScreen from './main/profile/Search';
import CameraScreen from './main/add/Camera';
import { storeUserFollowing, storeUser, storeUserPosts,  } from '../redux/actions';

const Tab = createMaterialBottomTabNavigator();
export default function Main({ navigation }) {
    const dispatch = useDispatch();
    // console.log("Main nav", navigation);

    useEffect(() => {
        storeUser(dispatch);
        storeUserPosts(dispatch);
        storeUserFollowing(dispatch);
    }, [])

    const currentUser = useSelector(userSelector);
    // console.log(currentUser);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Tab.Navigator initialRouteName="Feed" labeled={false}
                tabBarOptions={{
                    showIcon: true, showLabel: false, indicatorStyle: {opacity: 0}
                }}
                barStyle={{ backgroundColor: '#ffffff' }}>
                    
                <Tab.Screen key={Date.now()} name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }} />
                <Tab.Screen key={Date.now()} name="Camera" component={CameraScreen} navigation={navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="camera" color={color} size={26} />
                        ),
                    }} />
                {/* <Tab.Screen key={Date.now()} name="chat" component={ChatListScreen} navigation={props.navigation} share={false}
                    options={{
                        tabBarIcon: ({ color, size }) => (

                            <View>

                                {unreadChats ?
                                    <View style={{ backgroundColor: 'red', width: 10, height: 10, position: 'absolute', right: 0, borderRadius: 100 }}></View>

                                    :
                                    null
                                }
                                <View />

                                <MaterialCommunityIcons name="chat" color={color} size={26} />
                            </View>
                        ),
                    }} /> */}
                <Tab.Screen name="Profile" component={ProfileScreen} navigation={navigation}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ),
                    }} />
                <Tab.Screen key={Date.now()} name="Search" component={SearchScreen} navigation={navigation}
                    options={{
                        tabBarLabel: 'Seach',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        ),
                    }} />
            </Tab.Navigator>
        </View>
    )
}
