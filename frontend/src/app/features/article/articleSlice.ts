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
      // TODO: Надо реализовать удаление ссылок
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
    },
    setIdentifiers: (state : ArticleStateIFace, { payload }) => {
      if (state.current_article && payload) {
        state.current_article.identifiers = {...state.current_article.identifiers, ...payload}
      }
    },
    setCurrentArticle: (state: ArticleStateIFace, {payload}) => {
      if (payload) {
        state.current_article = payload
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
      backendApi.endpoints.deleteArticle.matchFulfilled,
      (state: ArticleStateIFace, action) => {
        if (action.payload) {
          const article = action.payload.data[0]
          const message = action.payload.message
          console.log(action.payload)
          if (message === 'article deleted permanent') {
            delete state.articles.entities[article.id]
            state.articles.ids = state.articles.ids.filter((id) => id !== article.id)
          } else {
            state.articles.entities[article.id] = article
          }
        }
      }
    )
    builder.addMatcher(
      // Если обновление на бэке не прошло валидацию, то перевыбрать изначальные данные из коллекции
      backendApi.endpoints.updateArticle.matchRejected,
      (state: ArticleStateIFace) => {
        const id = state.current_article?.id
        if (id) state.current_article = state.articles.entities[id]
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
  setAdditionalInformation,
  setCurrentArticle,
  setIdentifiers
} = articleSlice.actions