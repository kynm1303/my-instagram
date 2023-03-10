import { FontAwesome5 } from '@expo/vector-icons';
import firebase from 'firebase';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, Button, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-web';
import { connect, useSelector } from 'react-redux';
import { addComment, fetchPostComment } from '../../../redux/actions';
import feedSlice from '../../../redux/feedSlice';
import { postsSelector, userSelector, followSelector } from '../../../redux/selector';
import userSlice from '../../../redux/userSlice';
import { container, text, utils } from '../../styles';
import CachedImage from '../random/CachedImage';
require('firebase/firestore')

function Comment(props) {
  const [comments, setComments] = useState([])
  const { postId, userId } = props.route.params;
  const [commentInput, setCommentInput] = useState('');
  console.log("Comment: ", props.route.params);
  useEffect(() => {
    fetchPostComment(postId, userId)
      .then(setComments);
  }, [])

  // if (loading) {
  //   return (
  //     <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
  //       <ActivityIndicator style={{ alignSelf: 'center', marginBottom: 20 }} size="large" color="#00ff00" />
  //       <Text style={[text.notAvailable]}>Loading</Text>
  //     </View>
  //   )
  // }
  // if (user === null) {
  //   return (
  //     <View style={{ height: '100%', justifyContent: 'center', margin: 'auto' }}>
  //       <FontAwesome5 style={{ alignSelf: 'center', marginBottom: 20 }} name="dizzy" size={40} color="black" />
  //       <Text style={[text.notAvailable]}>User Not Found</Text>
  //     </View>
  //   )
  // }

  const handleSendComment = function () {
    if (commentInput == '') return;
    addComment(commentInput, userId, postId).then(setComments);
    setCommentInput('');
  }

  return (
    <View style={[container.container, utils.borderTopGray, utils.justifyCenter]}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={utils.padding10}>
            <View style={container.horizontal}>
              <FontAwesome5
                style={[utils.profileImageSmall]}
                name="user-circle" size={25} color="black"
                onPress={() => props.navigation.navigate("Profile", { uid: item.comment.creator, username: undefined })} />
              <View style={{ marginRight: 30 }}>
                <Text style={[utils.margin15Right, utils.margin5Bottom, { flexWrap: 'wrap' }]}>
                  <Text style={[text.bold]}
                    onPress={() => props.navigation.navigate("Profile", { uid: item.comment.creator, username: undefined })}>
                    {item.user.name}
                  </Text>
                  {" "}  {item.comment.text}
                </Text>
                <Text
                  style={[text.grey, text.small, utils.margin5Bottom]}>
                </Text>
              </View>
            </View>
          </View>
        )} />
      <View style={[container.horizontal, utils.alignItemsCenter, utils.borderTopGray, { height: 60 }]}>
        <TextInput
          style={[container.fillHorizontal, utils.padding10Sides]}
          placeholder="comment" value={commentInput} onChangeText={(value) => setCommentInput(value)} />
        <TouchableOpacity
          style={[{ width: 100}, utils.alignItemsCenter]}
          onPress={handleSendComment}>
            <Text style={[text.bold, text.medium, text.deepskyblue]} >Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Comment;

