import {CollectionStateIFace} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {backendApi} from "../../services/backend";

const initialState: CollectionStateIFace = {
    ids: [],
    entities: {}
}

export const collectionSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
          backendApi.endpoints.getMyCollections.matchFulfilled,
          (state: CollectionStateIFace, action) => {
            if (action.payload?.collections) {
              state.entities = action.payload.collections
              state.ids = Object.keys(action.payload.collections)
            }
          }
        )
      builder.addMatcher(
        backendApi.endpoints.createMyCollection.matchFulfilled,
        (state: CollectionStateIFace, action) => {
          if (action.payload) {
            if (state.ids.indexOf(action.payload.id) === -1) {
              state.ids.push(action.payload.id)
            }
            state.entities[action.payload.id] = action.payload
          }
        }
      )
      builder.addMatcher(
        backendApi.endpoints.updateMyCollection.matchFulfilled,
        (state: CollectionStateIFace, action) => {
          if (action.payload) {
            state.entities[action.payload.id] = action.payload
          }
        }
      )
      builder.addMatcher(
        backendApi.endpoints.deleteMyCollection.matchFulfilled,
        (state: CollectionStateIFace, action) => {
          const { collection_id } = action.payload
          state.ids = state.ids.filter((id) => id !== collection_id)
          delete state.entities[collection_id]
        }
      )
    }
})