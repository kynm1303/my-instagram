import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as firebase from 'firebase';

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {},
        posts: [],
        following: []
    },
    reducers: {
        storeUser: (state, action) => {
            // console.log("action", action);
            state.currentUser = { ...action.payload };
        },
        storePosts: (state, action) => {
            state.posts = action.payload;
        },
        fetchFollowing: (state, action) => {
            state.following = action.payload;
        },
        clearData: (state, action) => {
            state.currentUser = {}
            state.posts = []
            state.following = []
        }
    },
});



export default userSlice;