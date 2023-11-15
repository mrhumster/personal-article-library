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
    },
    setAdditionalInformation: (state: ArticleStateIFace, {payload}) => {
      if (state.current_article && payload) {
        state.current_article.additional_information = {...state.current_article.additional_information,  ...payload}
      }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      backendApi.endpoints.getArticles.matchFulfilled,
      (state: ArticleStateIFace, action) => {
        if (!action.payload) {
          state.articles.entities = {}
          state.articles.ids = []
        }
        if (action.payload?.articles) {
          state.articles.entities = action.payload.articles
          state.articles.ids = Object.keys(action.payload.articles)
        }
      }
    )
    builder.addMatcher(
      backendApi.endpoints.getArticles.matchRejected,
      (state: ArticleStateIFace) => {
        state.articles.entities = {}
        state.articles.ids = []
      }
    )
    builder.addMatcher(
      backendApi.endpoints.getArticle.matchFulfilled,
      (state: ArticleStateIFace, {payload}) => {
        if (payload) {
          state.current_article = payload
        } else {
          state.current_article = undefined
        }
      }
    )
    builder.addMatcher(
      backendApi.endpoints.updateArticle.matchFulfilled,
      (state: ArticleStateIFace, action) => {
        if (action.payload) {
          if (state.articles.ids.indexOf(action.payload.id) === -1) {
            state.articles.ids.push(action.payload.id)
          }
          state.articles.entities[action.payload.id] = action.payload

          if (action.payload.id === state.current_article?.id) {
            state.current_article = action.payload
          }
        }
      }
    )
    builder.addMatcher(
      backendApi.endpoints.addArticleFile.matchFulfilled,
      (state: ArticleStateIFace, action) => {
        const updatedArticleId = action.meta.arg.originalArgs.get('article')
        if (updatedArticleId === state.current_article?.id) {
          console.log('Похоже наша ссылка обогатилась файлом')
          // articleSlice.caseReducers.setCurrentArticle(state, {payload: updatedArticleId})
        }
      }
    )
  }
})

export const {
  addArticle,
  removeArticle,
  setCurrentReferenceType,
  setAdditionalInformation
} = articleSlice.actions