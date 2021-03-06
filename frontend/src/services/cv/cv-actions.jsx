import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const searchCvData = createAction("SEARCH_CV_DATA");
export const setSearchResult = createAction("SET_SEARCH_RESULT");
export const generateCv = createAction("GENERATE_CV",
  (accountId, locale) => ({ payload: { accountId, locale } }));

reducerRegistry.register(
  "cv",
  createReducer(
    {},
    {
      [generateCv]: (state) => {
        state.generateCvTimestamp = new Date();
      },
      [searchCvData]: (state, action) => {
        state.searchText = action.payload;
      },
      [setSearchResult]: (state, action) => {
        state.searchResult = action.payload;
      }
    }
  )
);