import {BaseQueryFn, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {isErrorWithDetail} from "../helpers.ts";
import {addMessage} from "../../features/alert";
import {getAccessToken} from "../../hooks";

const token = getAccessToken()

const baseQuery = fetchBaseQuery({
        baseUrl: `https://base/api/`,
        prepareHeaders: (headers: Headers) => {
          if (token) {
            headers.set("Authorization", `Bearer ${token}`)
          }
          return headers
        }
    }
)

export const baseQueryWithErrorHandler: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error) {
    console.log(result)
    if (isErrorWithDetail(result.error.data)) {
      console.log('che')
      api.dispatch(addMessage({message: result.error.data.detail, status: 'alert', progressMode: 'line'}))
    }
  }
  return result
}