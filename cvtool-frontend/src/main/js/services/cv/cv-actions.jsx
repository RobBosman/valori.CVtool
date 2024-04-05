import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

// Epic actions:
export const fetchCvByAccountId = createAction("FETCH_CV_BY_ACCOUNT_ID");
export const fetchCvHistory = createAction("FETCH_CV_HISTORY");
export const searchCvData = createAction("SEARCH_CV_DATA");
export const fetchDemoCv = createAction("FETCH_DEMO_CV",
  (accountId, locale) => ({ payload: { accountId, locale } }));
  // Reducer actions:
export const generateCv = createAction("GENERATE_CV",
  (accountId, locale) => ({ payload: { accountId, locale } }));
export const setSearchResult = createAction("SET_SEARCH_RESULT");
export const resetSearchData = createAction("RESET_SEARCH_DATA", () => ({}));

reducerRegistry.register(
  "cv",
  createReducer(
    {
      searchText: ""
    },
    builder => builder
      .addCase(generateCv, (state) => ({
        ...state,
        generateCvTimeString: new Date().toISOString()
      }))
      .addCase(searchCvData, (state, action) => ({
        ...state,
        searchText: action.payload
      }))
      .addCase(setSearchResult, (state, action) => ({
        ...state,
        searchResult: action.payload
      }))
      .addCase(resetSearchData, (state) => ({
        ...state,
        searchText: "",
        searchResult: undefined
      }))
  )
);