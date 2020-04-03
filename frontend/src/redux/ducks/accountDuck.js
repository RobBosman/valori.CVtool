"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit";

export const setAccountName = createAction("SET_ACCOUNT_NAME", (value, id) => ({payload: {value, id}}));

const accountReducer = createReducer({
        account: {}
    },
    {
        [setAccountName]: (state, action) => {
            state.account[action.payload.id].name = action.payload.value
        }
    });

export default accountReducer