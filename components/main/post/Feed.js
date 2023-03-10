import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { reload } from '../../../redux/actions';
import { feedSelector, feedUserSelector } from '../../../redux/selector';
import { container, utils } from '../../styles'
import Post from './Post';

export default function Feed(props) {

  const posts = useSelector(feedSelector);
  const users = useSelector(feedUserSelector);
  const [refreshing, setRefreshing] = useState(false);
  const { navigation } = props;
  const dispatch = useDispatch();

  console.log("Feed Component: posts", posts);
  console.log("Feed Component: users",  users);

  useEffect(() => {
    setRefreshing(false);
  }, [posts, users])

  const makeUser = function (post) {
    return users.find((user) => user.uid == post.userId);
  }

  const makeFlatListItemParams = function (post, index) {
    return {
      user: makeUser(post),
      item: post,
      index
    }
  }

  return (
    <View style={[container.container, utils.backgroundWhite]}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={posts}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              reload(dispatch);
            }}
          />
        }
        renderItem={({ item, index }) => (
          <View key={item.id}>
            <Post route={{ params: makeFlatListItemParams(item, index) }} navigation={navigation} />
          </View>
        )}
      />
    </View>
  )
}
