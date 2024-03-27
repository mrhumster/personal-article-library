import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {authSlice} from "../features/auth"
import { setupListeners } from "@reduxjs/toolkit/query";
import {snackBarSlice} from "../features/alert";
import {uiSlice} from "../features/ui";
import {backendApi} from "../services/backend";
import {articleSlice} from "../features/article";
import {collectionSlice} from "../features/collections";
import {googleBookApi} from "../services/googleBookApi.ts";
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
    [backendApi.reducerPath]: backendApi.reducer,
    [googleBookApi.reducerPath]: googleBookApi.reducer,
    auth: authSlice.reducer,
    snackBar: snackBarSlice.reducer,
    ui: uiSlice.reducer,
    articles: articleSlice.reducer,
    collections: collectionSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(backendApi.middleware)
            .concat(googleBookApi.middleware)
            .concat(thunk)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)