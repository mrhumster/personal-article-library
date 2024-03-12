import {ArticleIFace, FileScheme, HighlightScheme} from "./article.types.ts";
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

export interface ResponseWithHighlight extends Response {
  data: HighlightScheme[]
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

interface ShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

interface Explanation {
  value: number;
  description: string;
  details: Explanation[];
}


export interface SearchResponse<T> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: ShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
      _version?: number;
      _explanation?: Explanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      matched_queries?: string[];
      sort?: string[];
    }>;
  };
  suggest?: any;
  aggregations?: any;
}