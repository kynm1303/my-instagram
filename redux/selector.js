import { createSelector } from "@reduxjs/toolkit";

export const userSelector = (state) => {
    // console.log(state);
    return state.user.currentUser;
}

export const postsSelector = (state) => {
    // console.log(state);
    return state.user.posts;
}
export const followSelector = (state) => {
    // console.log(state);
    return state.user.following;
}

export const feedSelector = (state) => {
    return state.feed.feed;
}
export const feedUserSelector = (state) => {
    return state.feed.users;
}