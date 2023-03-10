import { configureStore } from "@reduxjs/toolkit";
import feedSlice from "./feedSlice";
import userSlice from "./userSlice";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        feed: feedSlice.reducer
    }
})

export default store;