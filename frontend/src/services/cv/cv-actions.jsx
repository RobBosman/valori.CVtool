import { createAction, createReducer } from "@reduxjs/toolkit";
import { reducerRegistry } from "../../redux/reducerRegistry";

export const fetchCvByAccountId = createAction("FECTH_CV_BY_ACCOUNT_ID");
export const generateCv = createAction("GENERATE_CV",
  (accountId, locale) => ({ payload: { accountId, locale } }));

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