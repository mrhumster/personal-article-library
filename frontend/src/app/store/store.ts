import { configureStore } from '@reduxjs/toolkit'
import {authSlice} from "../features/auth"
import { setupListeners } from "@reduxjs/toolkit/query";
import {snackBarSlice} from "../features/alert";
import {uiSlice} from "../features/ui";
import {backendApi} from "../services/backend";
import {articleSlice} from "../features/article";
import {collectionSlice} from "../features/collections";
import {googleBookApi} from "../services/googleBookApi.ts";


export const store = configureStore({
    reducer: {
        [backendApi.reducerPath]: backendApi.reducer,
        [googleBookApi.reducerPath]: googleBookApi.reducer,
        auth: authSlice.reducer,
        snackBar: snackBarSlice.reducer,
        ui: uiSlice.reducer,
        articles: articleSlice.reducer,
        collections: collectionSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(backendApi.middleware)
            .concat(googleBookApi.middleware)
})

setupListeners(store.dispatch)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch