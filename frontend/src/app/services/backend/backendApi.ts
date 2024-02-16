import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {ArticleIFace, ErrorResponse, NoteBookIFace, UserResponse} from "../../types";
import {baseQueryWithErrorHandler} from "./baseQuery.ts";
import {normalize, schema} from "normalizr";
import {ResponseWithArticle} from "../../types";
import {CollectionIFace} from "../../types";
import {ResponseWithFile} from "../../types/api.types.ts";

export const articleEntity = new schema.Entity('articles')
export const collectionsEntity = new schema.Entity('collections')

export const backendApi = createApi({
  reducerPath: 'backendApi',
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    getFile: builder.query({
      query: (file_id) => `/files/${file_id}`,
      transformResponse: (response: ResponseWithFile) => response.data[0]
    }),
    updateFile: builder.mutation({
      query: (data) => {
        const { id, ...body } = data
        return {
          url: `/files/${id}`,
          method: 'POST',
          body: body
        }
      }
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
      },
      transformResponse: (response: ResponseWithArticle) => response
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
    getArticleString: builder.query({
      query: (article_id) => {
        return {
          url: `/articles/${article_id}/str`
        }
      }
    }),
    getArticleListString: builder.mutation({
      query: (body: string[]) => {
        return {
          url: '/articles/str',
          method: 'POST',
          body: body
        }
      },
      transformResponse: (response: {data: {articles_string: string[]}[] }) => {return response.data[0]}
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
    }),
    deleteMyCollection: builder.mutation({
      query: (collection_id) => {
       return {
         url: `/collections/${collection_id}`,
         method: 'DELETE'
       }
      },
      transformErrorResponse: (response: ErrorResponse) => response.data.detail
    }),
    // NOTEBOOK ENDPOINTS
    getNoteBook: builder.query({
      query: (notebook_id) => `/notebooks/${notebook_id}`
    }),
    updateNoteBook: builder.mutation({
      query: (data) => {
        const { id, ...body } = data
        return {
          url: `/notebooks/${id}`,
          method: 'PUT',
          body: body
        }
      },
    }),
    createNoteBook: builder.mutation({
      query: (body: NoteBookIFace) => {
        return {
          url: '/notebooks/',
          method: 'POST',
          body: body
        }
      }
    }),
    deleteNoteBook: builder.mutation({
      query: (notebook_id) => {
        return {
          url: `/notebooks/${notebook_id}`,
          method: 'DELETE'
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
  useUpdateArticleMutation,
  useAddFileMutation,
  useGetFileQuery,
  useCreateArticleMutation,
  useCreateMyCollectionMutation,
  useGetMyCollectionsQuery,
  useUpdateMyCollectionMutation,
  useDeleteMyCollectionMutation,
  useGetDocumentQuery,
  useDeleteArticleMutation,
  useGetArticleStringQuery,
  useGetArticleListStringMutation,
  useUpdateFileMutation,
  useGetNoteBookQuery,
  useUpdateNoteBookMutation,
  useCreateNoteBookMutation,
  useDeleteNoteBookMutation
} = backendApi