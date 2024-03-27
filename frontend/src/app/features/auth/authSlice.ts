import { createSlice } from "@reduxjs/toolkit";
import { getUser, setUserData } from "../../hooks";
import {AuthState} from "../../types";
import {backendApi} from "../../services/backend";

const user= getUser()

const initialState: AuthState = {
  username: user?.username,
  email: user?.email,
  fullName: user?.fullName,
  isExists: user ? true : undefined,
  isLogin: !!user
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserAsExist: (state: AuthState, action) => {
      const data = action.payload.data[0]
      state.isExists = true
      state.email = data.email
    },
    setUserAsNotExist: (state: AuthState) => {
      state.isExists = false
    },
    setUsername: (state: AuthState, action) => {
      state.username = action.payload
    },
    setEmail: (state: AuthState, action) => {
      state.email = action.payload
    },
    setFullName: (state: AuthState, action) => {
      state.fullName = action.payload
    },
    setUserDataInRedux: (state: AuthState, {payload}) => {
      state.isLogin = true
      state.isExists = true
      state.email = payload.email
      state.fullName = payload.fullName
      state.username = payload.username
    },
    clearAuthData: (state: AuthState) => {
      state.isLogin = false
      state.isExists = undefined
      state.email = undefined
      state.username = undefined
      state.fullName = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.checkUsername.matchFulfilled,
      (state, {payload}) => {
        // В случае если пользователь существует
        state.isExists = true
        state.email = payload.email
        state.fullName = payload.fullName
      }
    )
    builder.addMatcher(
      backendApi.endpoints.checkUsername.matchRejected,
      (state) => {
        state.isExists = false
      }
    )
    builder.addMatcher(
      backendApi.endpoints.getToken.matchFulfilled,
      (state, {payload}) => {
        state.isLogin = true
        state.email = payload.user.email
        setUserData(payload)
      }
    )
    builder.addMatcher(
      backendApi.endpoints.getArticles.matchRejected,
      (state) => {
        state.isLogin = false
        state.isExists = undefined
        state.email = undefined
        state.username = undefined
        state.fullName = undefined
      }
    )
    builder.addMatcher(
      backendApi.endpoints.createUser.matchFulfilled,
      (state, {payload}) => {
        state.isLogin = true
        setUserData(payload)
      }
    )
  }
})

export const {
  setEmail,
  setUsername,
  setFullName,
  setUserAsExist,
  setUserAsNotExist,
  clearAuthData,
  setUserDataInRedux
} = authSlice.actions