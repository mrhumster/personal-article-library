import {createSlice} from "@reduxjs/toolkit";
import {ArticleStateIFace} from "../../types";
import {backendApi} from "../../services/backend";

const initialState: ArticleStateIFace = {
  articles: []
}

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    addArticle: (state: ArticleStateIFace, action) => {
      state.articles = [...state.articles, action.payload]
    },
    removeArticle: (state: ArticleStateIFace, action) => {
      state.articles.filter((item) => item === action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.getArticles.matchFulfilled,
      (state: ArticleStateIFace, {payload}) => {
        state.articles = payload
      }
    )
  }
})

export const {
  addArticle,
  removeArticle
} = articleSlice.actions