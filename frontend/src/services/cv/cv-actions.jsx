import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const generateCv = createAction("GENERATE_CV",
  (accountId, locale) => ({ payload: { accountId, locale } }));
export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");

reducerRegistry.register(
  "cv",
  createReducer(
    {},
    {
      [generateCv]: (state) => {
        state.generateCvTimestamp = new Date();
      }
    }
  )
);