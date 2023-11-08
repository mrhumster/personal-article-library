import {ArticleIFace} from "./article.types.ts";

export interface ErrorResponse {
  status: number,
  data: {
    detail: string
  }
}

export interface ResponseWithArticle {
  code: number,
  message: string,
  data: ArticleIFace[]
}