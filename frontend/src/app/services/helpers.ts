import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import {ResponseWithArticle} from "../types/api.types.ts";
import {ErrorDetailSchema} from "./backend/baseQuery.ts";
import {ArticleIFace} from "../types";

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


export function isErrorWithDetailList(error: unknown): error is { detail: ErrorDetailSchema[] } {
  return (
    typeof error === 'object' && error != null && 'detail' in error && typeof (error as any).detail === 'object'
  )
}

export function isResponseWithData(response: ResponseWithArticle) {
  return (
    typeof response === 'object' && response != null && 'data' in response && typeof (response as ResponseWithArticle).data === 'object'
  )
}

export const customDenormalize = (ids: string[], entities: { [key:  string]: ArticleIFace }) => {
  const _: [] = []
  ids.map(id => {
    const article = entities[id]
    _.push(article)})
  return _
}