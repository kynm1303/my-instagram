// import React from 'react'
// import { Text, View } from 'react-native'

// export default function Profile() {
//   return (
//     <View>

//         <Text>Profile</Text>
//     </View>
//   )
// }



import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, Button, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-web';
import { connect, useDispatch, useSelector } from 'react-redux';
import { reload, unsubscribeListener } from '../../../redux/actions';
import feedSlice from '../../../redux/feedSlice';
import { postsSelector, userSelector, followSelector } from '../../../redux/selector';
import userSlice from '../../../redux/userSlice';
import { container, text, utils } from '../../styles';
import CachedImage from '../random/CachedImage';
require('firebase/firestore')

// props.route.params.uid
function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = useSelector(userSelector);
  const posts = useSelector(postsSelector)
  const followingStore = useSelector(followSelector);
  const dispatch = useDispatch();

  const isMyUser = useMemo(() => {
    if (user == null) return false;
    // console.log(user);
    return user.uid == firebase.auth().currentUser.uid;
  }, [user])

  const handleSignOut = function () {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      dispatch(userSlice.actions.clearData());
      dispatch(feedSlice.actions.clearData());
      unsubscribeListener();
    }).catch((error) => {
      // An error happened.
    });
  }

  useEffect(() => {
    setRefreshing(false);
  }, [currentUser, posts, followingStore])

  // console.log("Profile: ", props);

  useEffect(() => {
    firebase.firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          props.navigation.setOptions({
            title: snapshot.data().username,
          })
          setUser({ uid: props.route.params.uid, ...snapshot.data() });
        }
        setLoading(false);
      })
    firebase.firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .orderBy("creation", "desc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data }
        })
        setUserPosts(posts)
      })

    if (followingStore.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }

  }, [props.route.params.uid, followingStore, currentUser, posts])

  const onFollow = function () {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }
  const onUnfollow = function () {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
  }


  if (loading) {
    return (
      <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
        <ActivityIndicator style={{ alignSelf: 'center', marginBottom: 20 }} size="large" color="#00ff00" />
        <Text style={[text.notAvailable]}>Loading</Text>
      </View>
    )
  }
  if (user === null) {
    return (
      <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
        <FontAwesome5 style={{ alignSelf: 'center', marginBottom: 20 }} name="dizzy" size={40} color="black" />
        <Text style={[text.notAvailable]}>User Not Found</Text>
      </View>
    )
  }

  const followingInfo = following ? (
    <TouchableOpacity
      style={[utils.buttonOutlined, container.container, utils.margin15Right]}
      title="Following"
      onPress={() => onUnfollow()}>
      <Text style={[text.bold, text.center, text.green]}>Unfollow</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[utils.buttonOutlined, container.container, utils.margin15Right]}
      title="Follow"
      onPress={() => onFollow()}>
      <Text style={[text.bold, text.center, { color: '#2196F3' }]}>Follow</Text>
    </TouchableOpacity>
  )

  const profileInfoComponent = <View style={[container.profileInfo]}>
    <View style={[utils.noPadding, container.row]}>
      <FontAwesome5
        style={[utils.profileImageBig, utils.marginBottomSmall]}
        name="user-circle" size={80} color="black" />

      <View style={[container.container, utils.padding10Sides]}>
        <View style={[container.container, container.horizontal, utils.justifyCenter]}>
          <View style={[utils.justifyCenter, text.center, container.containerImage]}>
            <Text style={[text.bold, text.large, text.center]}>{userPosts.length}</Text>
            <Text style={[text.center]}>Posts</Text>
          </View>
          <View style={[utils.justifyCenter, text.center, container.containerImage]}>
            <Text style={[text.bold, text.large, text.center]}>{user.followersCount}</Text>
            <Text style={[text.center]}>Followers</Text>
          </View>
          <View style={[utils.justifyCenter, text.center, container.containerImage]}>
            <Text style={[text.bold, text.large, text.center]}>{user.followingCount}</Text>
            <Text style={[text.center]}>Following</Text>
          </View>
        </View>
        {
        isMyUser && <TouchableOpacity
        style={utils.buttonOutlined}
        onPress={() => handleSignOut()}>
        <Text style={[text.bold, text.center]}>Sign Out</Text>
      </TouchableOpacity>
      }
      </View>
    </View>


    <View>
      <Text style={text.bold}>{user.name}</Text>
      <Text style={[text.profileDescription, utils.marginBottom]}>{user.description}</Text>
      {!isMyUser ? (
        <View style={[container.horizontal]}>
          {followingInfo}
          <TouchableOpacity
            style={[utils.buttonOutlined, container.container]}
            title="Follow">
            <Text style={[text.bold, text.center]}>Message</Text>
          </TouchableOpacity>
        </View>
      ) : (<TouchableOpacity
        style={utils.buttonOutlined}
        onPress={() => props.navigation.navigate('Edit')}>
        <Text style={[text.bold, text.center]}>Edit Profile</Text>
      </TouchableOpacity>)}
    </View>
  </View>

  // console.log("user Data Posts: ", userPosts);

  return (
    <View style={[utils.borderTopGray]}>
      <FlatList
        ListHeaderComponent={profileInfoComponent}
        numColumns={3}
        horizontal={false}
        data={userPosts}
        style={{}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              reload(dispatch);
            }}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[container.containerImage, utils.borderWhite]}
            onPress={() => props.navigation.navigate("Post", { item, user })}>
            {item.type == 0 ?
              (<CachedImage
                cacheKey={item.id}
                style={container.image}
                source={{ uri: item.downloadURLStill }}
              />) : (<CachedImage
                cacheKey={item.id}
                style={container.image}
                source={{ uri: item.downloadURL }}
              />)
            }
          </TouchableOpacity>
        )} />
    </View>
  )
}

export default Profile;

