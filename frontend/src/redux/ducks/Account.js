"use strict";

import {createAction, createReducer} from "@reduxjs/toolkit"

export const setAccountName = createAction("SET_ACCOUNT_NAME", (id, value) => ({payload: {id, value}}));

const initialSubState = {
    account: {}
};

const reducer = createReducer(initialSubState, {
    [setAccountName.type]: (state, action) => {
        state.account[action.payload.id].name = action.payload.value
    }
});

export default reducer