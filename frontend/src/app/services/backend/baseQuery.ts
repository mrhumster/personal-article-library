import {BaseQueryFn, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {isErrorWithDetail, isErrorWithDetailList} from "../helpers.ts";
import {addMessage} from "../../features/alert";
import {getAccessToken, logout} from "../../hooks";

const baseQuery = fetchBaseQuery({
        baseUrl: `/api/`,
        prepareHeaders: (headers: Headers) => headers.set("Authorization", `Bearer ${getAccessToken()}`)
    }
)

export interface ErrorDetailSchema {
  loc: string[]
  type: string
  msg: string
}

export const baseQueryWithErrorHandler: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error) {
    if (isErrorWithDetailList(result.error.data)) {
      result.error.data.detail.map((d: ErrorDetailSchema) => {
        const error_location = d.loc.map((location: string) => `${location} ->`).join(' ')
        const error_message = d.msg
        api.dispatch(addMessage({message: `${error_location} ${error_message}`, status: 'alert', progressMode: 'line'}))
      })
    }
    if (isErrorWithDetail(result.error.data)) {
      // TODO:  если 401 сделать навигацию на логин
      if (result.error.status === 401) logout()
      api.dispatch(addMessage({message: result.error.data.detail, status: 'alert', progressMode: 'line'}))
    }
  }
  return result
}