import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {
  ArticleIFace,
  ErrorResponse, FileScheme, NoteBookIFace,
  ResponseWithNotebook,
  SearchResponse,
  UserResponse
} from "../../types";
import {baseQueryWithErrorHandler} from "./baseQuery.ts";
import {normalize, schema} from "normalizr";
import {ResponseWithArticle} from "../../types";
import {CollectionIFace} from "../../types";
import {ResponseWithFile, ResponseWithHighlight} from "../../types/api.types.ts";
import {HighlightScheme} from "../../types/article.types.ts";

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
      query: (notebook_id) => `/notebooks/${notebook_id}`,
      transformResponse: (response: ResponseWithNotebook) => response.data[0]
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
    }),
    // HIGHLIGHT ENDPOINTS
    getHighlight: builder.query({
      query: (highlight_id) => `/highlights/${highlight_id}`,
      transformResponse: (response: ResponseWithNotebook) => response.data[0]
    }),
    updateHighlight: builder.mutation({
      query: (data) => {
        const { id, ...body } = data
        return {
          url: `/highlights/${id}`,
          method: 'PUT',
          body: body
        }
      },
    }),
    createHighlight: builder.mutation({
      query: (body: HighlightScheme) => {
        return {
          url: '/highlights/',
          method: 'POST',
          body: body
        }
      }
    }),
    deleteHighlight: builder.mutation({
      query: (highlight_id) => {
        return {
          url: `/highlights/${highlight_id}`,
          method: 'DELETE'
        }
      }
    }),
    getHighlightByFile: builder.query({
      query: (file_id) => `/highlights/by-file/${file_id}`,
      transformResponse: (response: ResponseWithHighlight) => response.data
    }),
    search: builder.query({
      query: (query) => {
        return {
          url: '/search/',
          params: query
        }
      },
      transformResponse: (response: SearchResponse<ArticleIFace | FileScheme>) => response.hits.hits
    }),
    suggest: builder.query({
      query: (arg) => {
        const {prefix, field_name} = arg
        return {
          url: '/search/suggest',
          params: {prefix, field_name}
        }
      },
      transformResponse: (response: SearchResponse<ArticleIFace | FileScheme>) => response.suggest['song-suggest'][0]['options']
    })
  }),
})

export const {
  useCheckUsernameQuery ,
  useGetTokenMutation,
  useCreateUserMutation,
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
  useDeleteNoteBookMutation,
  useGetHighlightQuery,
  useUpdateHighlightMutation,
  useCreateHighlightMutation,
  useDeleteHighlightMutation,
  useGetHighlightByFileQuery,
  useSearchQuery,
  useSuggestQuery
} = backendApi