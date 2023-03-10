import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as firebase from 'firebase';

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        users: [],
        feed: [],
    },
    reducers: {
        storeFeedUsers: (state, action) => {
            state.users = action.payload;
        },
        storeFeed: (state, action) => {
            state.feed = action.payload;
        },
        clearData: (state, action) => {
            state.users = []
            state.feed = []
        }
    },
});



export default feedSlice;