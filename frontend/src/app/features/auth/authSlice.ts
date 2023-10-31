import {BaseQueryFn, createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {createSlice} from "@reduxjs/toolkit";
import {getUser, setUserData} from "../../hooks/user.actions.ts";
import {addMessage} from "../alert";
import {isErrorWithDetail} from "../helpers.ts";

const user= getUser()

export interface ErrorResponse {
  status: number,
  data: {
    detail: string
  }
}

export interface UserResponse {
  id: string,
  email: string,
  username: string,
  fullName: string,
  disabled: boolean,
  theme: string
}

export interface UserIFace {
  username: string,
  password: string,
  email: string,
  fullName: string,
  disabled: boolean,
  theme: string
}

export interface AuthState {
  username: string | undefined,
  email: string | undefined,
  fullName: string | undefined
  isExists: boolean | undefined,
  isLogin: boolean
}

const initialState: AuthState = {
  username: user?.username,
  email: user?.email,
  fullName: user?.fullName,
  isExists: user ? true : undefined,
  isLogin: !!user
}

const baseQuery = fetchBaseQuery({
        baseUrl: `https://base/api/`,
        prepareHeaders: (headers: Headers) => {
            headers.set("Authorization", `Bearer `)
            return headers
        }
    }
)

const baseQueryWithErrorHandler: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error) {
    if (isErrorWithDetail(result.error.data)) {
      api.dispatch(addMessage({message: result.error.data.detail, status: 'alert', progressMode: 'line'}))
    }
  }
  return result
}

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    checkUsername: builder.query({
      query: (username) => `/users/${username}`,
      transformResponse: (response: { data: UserResponse[] }) => response.data[0],
      transformErrorResponse: (response: ErrorResponse) => response.data
    }),
    getToken: builder.mutation({
      query: (args) => {
        const formData = new URLSearchParams()
        formData.append('username', args.username)
        formData.append('password', args.password)
        return {
          url: '/users/token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;'
          },
          body: formData,
          formData: true
        }
      },
      transformErrorResponse: (response: ErrorResponse) => response.data.detail
    }),
    createUser: builder.mutation({
      query: (args) => {
        return {
          url: '/users/create',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(args)
        }
      }
    })
  }),
})

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
    setFullNameAction: (state: AuthState, action) => {
      state.fullName = action.payload
    },
    clearAuthData: (state: AuthState) => {
      state.isExists = undefined
      state.isLogin = false
      state.username = undefined
      state.email = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.checkUsername.matchFulfilled,
      (state, {payload}) => {
        // В случае если пользователь существует
        state.isExists = true
        state.email = payload.email
      }
    )
    builder.addMatcher(
      backendApi.endpoints.checkUsername.matchRejected,
      (state, action) => {
        console.log(action.payload)
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
  setFullNameAction,
  setUserAsExist,
  setUserAsNotExist,
  clearAuthData
} = authSlice.actions


export const {
  useCheckUsernameQuery ,
  useGetTokenMutation,
  useCreateUserMutation
} = backendApi