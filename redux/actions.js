import * as Notifications from 'expo-notifications';
import { DEFAULT_ACTION_IDENTIFIER } from 'expo-notifications';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import feedSlice from './feedSlice';
import userSlice from './userSlice';
require('firebase/firestore');

const unsubscribe = [];

export const unsubscribeListener = function () {
    for (let unsub of unsubscribe) {
        unsub();
    }
    unsubscribe = [];
}

export const reload = function (dispatch) {
    storeUser(dispatch);
    storeUserPosts(dispatch);
    storeUserFollowing(dispatch);
}

export const fetchMyUser = function () {
    return fetchUserByUserId(firebase.auth().currentUser.uid);
}

export const fetchUserByUserId = function (userId) {
    return firebase.firestore()
        .collection("users")
        .doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                console.log("fetch User by user id: ", userId, doc.data());
                return doc.data()
            }
            else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document: ", error);
        })
}

export const fetchMyUserPosts = function () {
    return fetchUserPostsByUserId(firebase.auth().currentUser.uid);
}

export const fetchUserPostsByUserId = function (userId) {
    return firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .orderBy("creation", "desc")
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data();
                data.creation = data.creation.seconds;
                const id = doc.id;
                return { id, ...data }
            })
            return posts;
        })
}

export const storeUserPosts = function (dispatch) {
    fetchMyUserPosts()
        .then((posts) => {
            dispatch(userSlice.actions.storePosts(posts))
        })
        .catch((error) => console.log(error));
}

export const storeUser = function (dispatch) {
    fetchMyUser()
        .then((user) => {
            dispatch(userSlice.actions.storeUser(user));
        })
        .catch((error) => console.log(error));
}

export function storeUserFollowing(dispatch) {
    const listener = firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id
            })
            console.log("fetchUserFollowing: ", following);
            dispatch(userSlice.actions.fetchFollowing(following));
            storeFeedUser(dispatch, following);
        })
    unsubscribe.push(listener);
}

export function storeFeedUser(dispatch, followUserIds) {
    Promise.all(
        followUserIds.map((uid) => {
            return fetchUserByUserId(uid)
                .then((user) => { return { ...user, uid } })
        }))
        .then((users) => {
            console.log("storeFeedUsers: ", users);
            dispatch(feedSlice.actions.storeFeedUsers(users))
            return {};
        })
        .then(() => storeFeed(dispatch, followUserIds));
}

export function storeFeed(dispatch, followUserIds) {
    Promise.all(
        followUserIds.map((userId) => {
            return fetchUserPostsByUserId(userId)
                .then((posts) => posts.map(
                    (post) => { return { ...post, userId } }
                ))
        }))
        .then((queries) => {
            let newFeeds = [];
            for (let posts of queries) {
                newFeeds = [...newFeeds, ...posts];
            }
            console.log("storeFeed: ", newFeeds);
            dispatch(feedSlice.actions.storeFeed(newFeeds))
        })
}

export const queryUsersByUsername = function (username) {
    if (username.length == 0) {
        return new Promise((resolve, reject) => { resolve([]) });
    }
    return firebase.firestore()
        .collection('users')
        .where('name', '>=', username)
        .limit(10)
        .get()
        .then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                console.log("queryUsersByUsername", data, id);
                return { id, ...data }
            });
            return (users);
        })
}

export const fetchPostComment = function (postId, userId) {
    if (postId == null) return;
    console.log("fetchPostComment", userId, postId);
    return firebase.firestore()
        .collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
            let comments = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                console.log("fetchPostComment", data, id);
                return { id, ...data }
            });
            return (comments);
        })
        .then((comments) => {
            return Promise.all(
                comments.map((comment) =>
                    fetchUserByUserId(comment.creator)
                        .then((user) => {
                            // console.log(user);
                            return { user, comment };
                        })
                )
            )
        })
        .catch((error) => console.log(error));
}

export const addComment = function (comment, userId, postId) {
    console.log("addComment: ", comment, userId, postId);
    let object = {
        creator: firebase.auth().currentUser.uid,
        text: comment
    }
    const postRef = firebase.firestore()
    .collection('posts')
    .doc(userId)
    .collection('userPosts')
    .doc(postId);

    postRef
    .collection('comments')
    .add(object)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
    
    return postRef
    .update({
        commentsCount: firebase.firestore.FieldValue.increment(1) 
    })
    .then(() => fetchPostComment(postId, userId))
}

export const fetchOnUserLike = function (userId, postId, setCurrentUserLikeCallback) {
    return firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((snapshot) => {
            let currentUserLike = false;
            if (snapshot.exists) {
                currentUserLike = true;
            }
            setCurrentUserLikeCallback(currentUserLike);
        })
}

export const addUserLike = function (userId, postId) {
    if (userId == null) return;
    if (postId == null) return;
    console.log("addUserLike: ", userId, postId);

    const postRef = firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)

    postRef
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .set({})

    return postRef.update({
        likesCount: firebase.firestore.FieldValue.increment(1)
    })
        .then(() => postRef.get())
        .then((doc) => doc.data().likesCount)
}

export const deleteUserLike = function (userId, postId) {
    if (userId == null) return;
    if (postId == null) return;
    console.log("deleteUserLike: ", userId, postId);

    const postRef = firebase.firestore()
        .collection("posts")
        .doc(userId)
        .collection("userPosts")
        .doc(postId)
    postRef
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .delete()
    return postRef.update({
        likesCount: firebase.firestore.FieldValue.increment(-1)
    })
        .then(() => postRef.get())
        .then((doc) => doc.data().likesCount)
}
