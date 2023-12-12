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

export interface IndustryIdentifiersIFace {
  type: string
  identifier: string
}

export interface VolumeIFace {
  volumeInfo: {
    title: string
    authors: string[]
    imageLinks: {
      thumbnail: string
    }
    publisher: string
    publishedDate: string
    pageCount: string
    categories: string[]
    language: string
    description: string
    industryIdentifiers: IndustryIdentifiersIFace[]
  }
}