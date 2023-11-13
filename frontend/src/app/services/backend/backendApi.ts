import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {ArticleIFace, ErrorResponse, UserResponse} from "../../types";
import {baseQueryWithErrorHandler} from "./baseQuery.ts";
import {normalize, schema} from "normalizr";
import {isResponseWithData} from "../helpers.ts";

export const articleEntity = new schema.Entity('articles')

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    updateArticle: builder.mutation({
      query: (data) => {
        const { id, ...body } = data
        return {
          url: `/articles/${id}`,
          method: 'PUT',
          body: body
        }
      },
      transformResponse: (response) => {
        if (isResponseWithData(response)) {
            return response.data[0]
        }
      },
    }),
    getArticle: builder.query({
      query: (article_id) => `/articles/${article_id}`
    }),
    getArticles: builder.query({
      query: () => '/articles/',
      transformResponse: (response: { articles: ArticleIFace[] }) => {
        const normalized = normalize(response.articles, [articleEntity])
        return normalized.entities
      },
      transformErrorResponse: (response: ErrorResponse) => response.data
    }),
    addArticleFile: builder.mutation({
      query: (body) => {
        return {
          url: '/articles/upload',
          method: 'POST',
          body: body,
          formData: true
        }
      },
      transformErrorResponse: (response: ErrorResponse) => response.data
    }),
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

export const {
  useCheckUsernameQuery ,
  useGetTokenMutation,
  useCreateUserMutation,
  useAddArticleFileMutation,
  useGetArticlesQuery,
  useGetArticleQuery,
  useUpdateArticleMutation
} = backendApi