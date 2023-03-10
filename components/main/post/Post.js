import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { cancelScheduledNotificationAsync } from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { Button, Image, Text, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-paper';
import { addUserLike, deleteUserLike, fetchOnUserLike, handleFix } from '../../../redux/actions';
import { container, text, utils } from '../../styles';
import firebase from 'firebase';
import { userSelector } from '../../../redux/selector';
import CachedImage from '../random/CachedImage';
import ParsedText from 'react-native-parsed-text';
import { timeDifference } from '../../utils';

require('firebase/firestore');

export default function Post(props) {
  const item = props.route.params.item;
  const { caption, commentCount, creation, downloadURL, id, type } = item;
  const user = props.route.params.user;
  if (user == null) return <View></View>;
  const userId = user.uid;
  const postId = id;

  // const [loaded, setLoaded] = useState(false);

  const [currentUserLike, setCurrentUserLike] = useState(false);

  const [likesCount, setLikesCount] = useState(item.likesCount);
  console.log("Posts: ", item, user);

  const likesCountCheck = function (remote) {
    // console.log("likesCountCheck: ", remote, likesCount);
    // if (remote === likesCount) return;
    setLikesCount(remote);
  }

  useEffect(() => {
    fetchOnUserLike(userId, postId, setCurrentUserLike);
  }, [])

  useEffect(() => {
    // console.log("currentUserLike: ", currentUserLike);
  }, [currentUserLike])

  const handleLikePress = () => {
    setLikesCount(likesCount + 1);
    addUserLike(userId, postId).then(likesCountCheck);
  }
  const handleDislikePress = () => {
    setLikesCount(likesCount - 1);
    deleteUserLike(userId, postId).then(likesCountCheck);
  };

  const handleUserNamePress = () => {
    props.navigation.navigate('Profile', { uid: userId });
  }

  const heartIcon = currentUserLike ? <Entypo name="heart" size={30} color="red" onPress={() => handleDislikePress()} />
    : <Feather name="heart" size={30} color="black" onPress={() => handleLikePress()} />

  // if (!loaded) 
  //   return <View></View>

  return (
    <View>
      {user && <View style={[utils.backgroundWhite]}>
        <View style={[container.horizontal, { alignItems: 'center', padding: 10 }]}>
          <TouchableOpacity
            style={[container.horizontal, utils.alignItemsCenter]}
            onPress={() => props.navigation.navigate("Profile", { uid: user.uid, username: undefined })}>
            <FontAwesome5
              style={[utils.profileImageSmall]}
              name="user-circle" size={25} color="black" />
            <View style={{ alignSelf: 'center' }}>
              <Text style={[text.bold, text.medium, { marginBottom: 0 }]} >{user.name}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[{ marginLeft: 'auto' }]}

          // onPress={() => {
          //   if (props.route.params.feed) {
          //     props.route.params.setModalShow({ visible: true, item })
          //   } else {
          //     setModalShow({ visible: true, item })
          //   }
          // }}
          >
            <Feather
              name="more-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <CachedImage
          cacheKey={item.id}
          style={container.image}
          source={{ uri: item.downloadURL }}
        />
        <View style={[utils.padding10, container.horizontal]}>
          {heartIcon}
          <Feather style={utils.margin15Left} name="message-square" size={30} color="black"
            onPress={() => props.navigation.navigate('Comment', { postId: postId, userId: user.uid, user })} />
        </View>
        <View style={[utils.padding10Sides]}>
          <View>
            <Text style={[text.bold, text.medium]}>
              {likesCount} likes
            </Text>
            <Text style={[utils.margin15Right, utils.margin5Bottom]}>
              <Text style={[text.bold, utils.padding10Sides]}
                onPress={() => props.navigation.navigate("Profile", { uid: user.uid, username: undefined })}>
                {user.name}
              </Text>
              <Text>    </Text>
              <ParsedText
                parse={
                  [
                    { pattern: /@(\w+)/, style: { color: 'green', fontWeight: 'bold' }, onPress: handleUserNamePress },
                  ]
                }
              >{item.caption}</ParsedText>
            </Text>
            <Text
              style={[text.grey, utils.margin5Bottom]} onPress={() => props.navigation.navigate('Comment', { postId: id, userId: user.uid })}>
              {item.commentsCount > 0 ? `View all ${item.commentsCount} Comments` : "No ones have comment yet"}
            </Text>
            {/* <Text
            style={[text.grey, text.small, utils.margin5Bottom]}>
            {timeDifference(new Date(), item.creation)}
          </Text> */}
          </View>

        </View>
      </View>}
    </View>
  )
}
