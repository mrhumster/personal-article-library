import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

export const googleBookApi = createApi({
  reducerPath: 'googleBookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.googleapis.com/books/v1/'}),
  endpoints: (builder) => ({
    getMeta: builder.query({
      query: (isbn) => `volumes?q=isbn:${isbn.replace('-', '')}`
    })
  })
})

export const {
  useGetMetaQuery
} = googleBookApi