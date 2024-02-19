import {ArticleIFace, FileScheme} from "./article.types.ts";
import {CollectionIFace} from "./collection.types.ts";
import {NoteBookIFace} from "./notebook.types.ts";

export interface ErrorResponse {
  status: number,
  data: {
    detail: string
  }
}

export interface Response {
  code: number,
  message: string
}

export interface ResponseWithCollection extends Response {
  data: CollectionIFace[]
}

export interface ResponseWithNotebook extends Response {
  data: NoteBookIFace[]
}

export interface ResponseWithArticle extends Response{
  data: ArticleIFace[]
}

export interface ResponseWithFile extends Response{
  data: FileScheme[]
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