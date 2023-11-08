import {createSlice} from "@reduxjs/toolkit";
import {ArticleStateIFace} from "../../types";
import {backendApi} from "../../services/backend";

const initialState: ArticleStateIFace = {
  articles: {
    ids: [],
    entities: {}
  },
  current_article: undefined
}

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    addArticle: (state: ArticleStateIFace, action) => {
      if (state.articles.ids.indexOf(action.payload.id) === -1) {
        state.articles.ids.push(action.payload.id)
      }
      state.articles.entities[action.payload.id] = action.payload
    },
    removeArticle: (state: ArticleStateIFace, action) => {
      // TODO: Не реализовано
      console.log(state)
      console.log(action.payload)
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
      (state: ArticleStateIFace, action) => {
        if (action.payload.articles) {
          state.articles.entities = action.payload.articles
          state.articles.ids = Object.keys(action.payload.articles)
        }
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
      (state: ArticleStateIFace, action) => {
        if (state.articles.ids.indexOf(action.payload.id) === -1) {
          state.articles.ids.push(action.payload.id)
        }
        state.articles.entities[action.payload.id] = action.payload

        if (action.payload.id === state.current_article?.id) {
          state.current_article = action.payload
        }
      }
    )
  }
})

export const {
  addArticle,
  removeArticle,
  setCurrentReferenceType
} = articleSlice.actions