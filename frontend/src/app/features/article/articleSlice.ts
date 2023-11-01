import {createSlice} from "@reduxjs/toolkit";
import {ArticleIFace} from "../../types";

const initialState: ArticleIFace[] = []

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    addArticle: (state: ArticleIFace[], action) => [...state, action.payload],
    removeArticle: (state: ArticleIFace[], action) => state.filter((item) => item === action.payload)
  }
})

export const {
  addArticle,
  removeArticle
} = articleSlice.actions
export default articleSlice