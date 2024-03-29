import {createSlice} from "@reduxjs/toolkit";
import {ArticleStateIFace, AuthorIFace} from "../../types";
import {backendApi} from "../../services/backend";
import {ArticleURLs} from "../../types/article.types.ts";

const initialState: ArticleStateIFace = {
  articles: {
    ids: [],
    entities: {}
  },
  current_article: undefined,
  new_article: undefined
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
    setPublicationDetails: (state: ArticleStateIFace, {payload}) => {
      if (state.current_article && payload) {
        state.current_article.publication = {...state.current_article.publication, ...payload}
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
    },
    setCurrentArticleTitle: (state: ArticleStateIFace, {payload}:{payload : string}) => {
      if (state.current_article) state.current_article.title = payload
    },
    setCurrentAuthors: (state: ArticleStateIFace, {payload}:{payload: AuthorIFace[]}) => {
      if (state.current_article) state.current_article.authors = payload
    },
    setCurrentUrls: (state: ArticleStateIFace, {payload}:{payload: ArticleURLs}) => {
      if (state.current_article) state.current_article.urls = payload
    },
    setCurrentNoteBooks: (state: ArticleStateIFace, {payload}:{payload: string[]}) => {
      if (state.current_article) state.current_article.notebooks = payload
    },
    addNoteBook: (state: ArticleStateIFace, {payload}:{payload: string}) =>{
      if (state.current_article) state.current_article.notebooks = [...state.current_article.notebooks || [], payload]
    },
    resetArticle: () => {
      return initialState
    },
    initNewArticle: (state: ArticleStateIFace) => {
      state.new_article = {id: 'new', reference_type: 0, title: null, additional_information: {}}
    },
    setNewArticleReferenceType: (state: ArticleStateIFace, {payload}:{payload: number}) => {
      if (state.new_article) state.new_article.reference_type = payload
    },
    setNewArticleTitle: (state: ArticleStateIFace, {payload}: {payload: string | null}) => {
      if (state.new_article) state.new_article.title = payload
    },
    setNewArticleAuthors: (state: ArticleStateIFace, {payload}: {payload: AuthorIFace[]}) => {
      if (state.new_article) state.new_article.authors = payload
    },
    setNewArticlePublicationDetails: (state: ArticleStateIFace, {payload}) => {
      if (state.new_article && payload) state.new_article.publication = {...state.new_article.publication, ...payload}
    },
    setNewArticleAdditionalInformation: (state: ArticleStateIFace, {payload}) => {
      if (state.new_article && payload) state.new_article.additional_information = {...state.new_article.additional_information, ...payload}
    },
    setNewArticleDescription: (state: ArticleStateIFace, {payload}: {payload: string | null}) => {
      if (state.new_article) state.new_article.description = payload
    },
    addFileInCurrentArticle: (state: ArticleStateIFace, {payload}) => {
      if (state.current_article) state.current_article.files = [...state.current_article.files, payload]
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
      backendApi.endpoints.getArticle.matchFulfilled,
      (state: ArticleStateIFace, action) => {
        if (action.payload) {
          const id = action.payload.id
          if (id) {
            if (state.articles.ids.indexOf(id) === -1) {
              state.articles.ids.push(id)
            }
            state.articles.entities[id] = action.payload
            if (id === state.current_article?.id) {
              state.current_article = action.payload
            }
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
  }
})

export const {
  addArticle,
  removeArticle,
  setCurrentReferenceType,
  setAdditionalInformation,
  setCurrentArticle,
  setIdentifiers,
  setPublicationDetails,
  setCurrentArticleTitle,
  setCurrentAuthors,
  setCurrentUrls,
  resetArticle,
  setCurrentNoteBooks,
  addNoteBook,
  initNewArticle,
  setNewArticleReferenceType,
  setNewArticleTitle,
  setNewArticleAuthors,
  setNewArticlePublicationDetails,
  setNewArticleAdditionalInformation,
  setNewArticleDescription,
  addFileInCurrentArticle
} = articleSlice.actions