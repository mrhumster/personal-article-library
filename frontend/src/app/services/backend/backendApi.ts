import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {ArticleIFace, ErrorResponse, UserResponse} from "../../types";
import {baseQueryWithErrorHandler} from "./baseQuery.ts";
import {normalize, schema} from "normalizr";
import {ResponseWithArticle} from "../../types";
import {CollectionIFace} from "../../types";

export const articleEntity = new schema.Entity('articles')
export const collectionsEntity = new schema.Entity('collections')

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    getFile: builder.query({
      query: (file_id) => `/files/${file_id}`
    }),
    getDocument: builder.query({
      query: (file_uuid) => `../media/${file_uuid}`
    }),
    addFile: builder.mutation({
      query: (body) => {
        return {
          url: '/files/',
          method: 'POST',
          body: body,
          formData: true
        }
      },
    }),
    createArticle: builder.mutation({
      query: (body) => {
        return {
          url: '/articles/',
          method: 'POST',
          body: body
        }
      }
    }),
    deleteArticle: builder.mutation({
      query: (id: string) => {
        return {
          url: `/articles/${id}`,
          method: 'DELETE'
        }
      }
    }),
    updateArticle: builder.mutation({
      query: (data) => {
        const { id, ...body } = data
        return {
          url: `/articles/${id}`,
          method: 'PUT',
          body: body
        }
      },
      transformResponse: (response: ResponseWithArticle) => {
        if (response) {
          return response.data[0]
        }
      },
    }),
    getArticle: builder.query({
      query: (article_id) => `/articles/${article_id}`,
      transformResponse: (response: ResponseWithArticle) => {
        if (response) {
          return response.data[0]
        }
      }
    }),
    getArticles: builder.query({
      query: () => '/articles/',
      transformResponse: (response: { articles: ArticleIFace[] }) => {
        if (response) {
          const normalized = normalize(response.articles, [articleEntity])
          return normalized.entities
        }
      },
      transformErrorResponse: (response: ErrorResponse) => response.data
    }),
    addArticleFile: builder.mutation({
      // TODO: Надо убирать
      query: (body) => {
        return {
          url: '/articles/upload',
          method: 'POST',
          body: body,
          formData: true
        }
      },
      transformErrorResponse: (response: ErrorResponse) => {response.data}
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
    }),
    getMyCollections: builder.query({
      query: () => '/collections/',
      transformResponse: (response: CollectionIFace[]) => {
        if (response) {
          const normalized = normalize(response, [collectionsEntity])
          return normalized.entities
        }
      },
    }),
    createMyCollection: builder.mutation({
      query: (body: CollectionIFace) => {
        return {
          url: '/collections/',
          method: 'POST',
          body: body
        }
      }
    }),
    updateMyCollection: builder.mutation({
      query: (data) => {
        const { collection_id, ...body } = data
        return {
          url: `/collections/${collection_id}`,
          method: 'PUT',
          body: body
        }
      },
      transformResponse: (response : { data: CollectionIFace[] }) => {return response.data[0]},
      transformErrorResponse: (response: ErrorResponse) => response.data.detail,
      /* Пример использования асинхронной функции добавления кеша
      https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        const state = getState()
        const alert: Item = {
          message: `Коллекция "${state.collections.entities[arg.collection_id].title}" обновилась.`,
          status: "normal",
          progressMode: 'timer',
        }
        console.log(arg)
        console.log(getState())
        dispatch(addMessage(alert))
      },

       */
    }),
    deleteMyCollection: builder.mutation({
      query: (collection_id) => {
       return {
         url: `/collections/${collection_id}`,
         method: 'DELETE'
       }
      },
      transformErrorResponse: (response: ErrorResponse) => response.data.detail
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
  useUpdateArticleMutation,
  useAddFileMutation,
  useGetFileQuery,
  useCreateArticleMutation,
  useCreateMyCollectionMutation,
  useGetMyCollectionsQuery,
  useUpdateMyCollectionMutation,
  useDeleteMyCollectionMutation,
  useGetDocumentQuery,
  useDeleteArticleMutation
} = backendApi