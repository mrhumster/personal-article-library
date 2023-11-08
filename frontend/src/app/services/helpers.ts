import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {ResponseWithArticle} from "../types/api.types.ts";
import {ArticleIFace} from "../types";
import {ArticleDetail} from "../components/article";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' && error != null && 'message' in error && typeof (error as any).message === 'string'
  )
}
/**
 * Type predicate to narrow an unknown error to an object with a string 'detail' property
 */
export function isErrorWithDetail(error: unknown): error is { detail: string } {
  return (
    typeof error === 'object' && error != null && 'detail' in error && typeof (error as any).detail === 'string'
  )
}

export function isResponseWithData(response: ResponseWithArticle) {
  return (
    typeof response === 'object' && response != null && 'data' in response && typeof (response as any).data === 'object'
  )
}

export const customDenormalize = (ids: string[], entities: { [key:  string]: object }) => {
  const _: [] = []
  ids.map(id => {
    const article = entities[id]
    _.push(article)})
  return _
}