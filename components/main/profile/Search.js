// import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { queryUsersByUsername } from '../../../redux/actions';
import { container, text, utils } from '../../styles';

require('firebase/firestore');

function Search(props) {
    const [users, setUsers] = useState([])
    return (
        <View style={{ ...utils.backgroundWhite, ...container.container }}>
            <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
                <TextInput
                    style={utils.searchBar}
                    placeholder="Type Here..."
                    onChangeText={(search) => {
                        queryUsersByUsername(search).then((users) => setUsers(users));
                    }} />
            </View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[container.horizontal, utils.padding10Sides, utils.padding10Top]}
                        onPress={() => props.navigation.navigate("Profile", { uid: item.id, username: undefined })}>
                        <View style={[utils.alignItemsCenter, container.horizontal]}>
                            <FontAwesome5
                                style={[utils.profileImageSmall]}
                                name="user-circle" size={25} color="black" />
                            {/* <Text style={text.name} >{item.name}</Text> */}
                            <Text style={[text.bold, text.medium, { marginBottom: 0 }]} >{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Search;