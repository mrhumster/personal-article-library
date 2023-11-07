import {createSlice} from "@reduxjs/toolkit";
import {ArticleStateIFace} from "../../types";
import {backendApi} from "../../services/backend";

const initialState: ArticleStateIFace = {
  articles: [],
  current_article: undefined
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
    },
    setCurrentReferenceType: (state: ArticleStateIFace, action) => {
      if (state.current_article) {
        state.current_article.reference_type = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.getArticles.matchFulfilled,
      (state: ArticleStateIFace, {payload}) => {
        state.articles = payload
      }
    )
    builder.addMatcher(
      backendApi.endpoints.getArticle.matchFulfilled,
      (state: ArticleStateIFace, {payload}) => {
        state.current_article = payload.data[0]
      }
    )
    builder.addMatcher(
      backendApi.endpoints.updateArticle.matchFulfilled,
      (state: ArticleStateIFace, {payload}) => {
        state.current_article = payload.data[0]
      }
    )
  }
})

export const {
  addArticle,
  removeArticle,
  setCurrentReferenceType
} = articleSlice.actions