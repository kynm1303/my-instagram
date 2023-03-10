import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';


import LandingScreen from './components/auth/Landing';
import MainScreen from './components/Main';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login.js';
import SaveScreen from './components/main/add/Save';

import { onAuthStateChanged, signOut } from "firebase/auth";
import { Provider } from 'react-redux';
import store from './redux/store';
import ProfileScreen from './components/main/profile/Profile';
import PostScreen from './components/main/post/Post';
import EditScreen from './components/main/profile/Edit';
import CommentScreen from './components/main/post/Comment';

const Stack = createStackNavigator();

require("./firebaseConfig.js")

const App = function () {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false)
      } else {
        setLoggedIn(true);
      }
    })
  }, [])

  const getOptions = function ({ route }) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
    switch (routeName) {
      case 'Camera': {
        headerTitle = 'Camera';
        break;
      }
      case 'chat': {
        headerTitle = 'Chat';
        break;
      }
      case 'Profile': {
        headerTitle = 'Profile';
        break;
      }
      case 'Search': {
        headerTitle = 'Search';
        break;
      }
      case 'Feed':
      default: {
        headerTitle = 'Instagram';
        break;
      }
    }
    return {
      headerTitle
    }
  }

  if (loggedIn) {
    return <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Main" options={getOptions}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Save" component={SaveScreen} />
          <Stack.Screen name="Comment" component={CommentScreen} />
          <Stack.Screen name="Edit" component={EditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  }

  return <NavigationContainer >
    <Stack.Navigator initialRouteName='Landing'>
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

    </Stack.Navigator>
  </NavigationContainer >
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
