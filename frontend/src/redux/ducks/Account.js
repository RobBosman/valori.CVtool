"use strict";

const SET_ACCOUNT_NAME = "SET_ACCOUNT_NAME";

export const setAccountName = (id, value) => ({type: SET_ACCOUNT_NAME, id, value});

const initialSubState = {
    account: {}
};

const reducer = (subState = initialSubState, action) => {
    switch (action.type) {
        case SET_ACCOUNT_NAME:
            return {
                ...subState,
                account: {
                    ...subState.account,
                    [action.id]: {
                        ...subState.account[action.id],
                        name: action.value
                    }
                }
            };
        default:
            return subState
    }
};

export default reducer