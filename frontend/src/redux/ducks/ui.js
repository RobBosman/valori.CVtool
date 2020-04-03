"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";

export const setLocale = createAction("SET_LOCALE");
export const setAccountId = createAction("SET_ACCOUNT_ID");

const uiReducer = createReducer({
        locale: 'nl_NL'
    },
    {
        [setLocale]: (state, action) => {
            state.locale = action.payload
        },
        [setAccountId]: (state, action) => {
            state.accountId = action.payload
        }
    });

export default uiReducer