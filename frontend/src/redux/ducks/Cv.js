"use strict";

const SET_CV_FUNCTION = "SET_CV_FUNCTION";
const SET_CV_PERSONALITY = "SET_CV_PERSONALITY";
const SET_CV_INTERESTS = "SET_CV_INTERESTS";

export const setCvFunction = (id, value) => ({type: SET_CV_FUNCTION, id, value});
export const setCvPersonality = (id, locale, value) => ({type: SET_CV_PERSONALITY, id, locale, value});
export const setCvInterests = (id, locale, value) => ({type: SET_CV_INTERESTS, id, locale, value});

const initialSubState = {
    cv: {}
};

const reducer = (subState = initialSubState, action) => {
    switch (action.type) {
        case SET_CV_FUNCTION:
            return {
                ...subState,
                cv: {
                    ...subState.cv,
                    [action.id]: {
                        ...subState.cv[action.id],
                        function: action.value
                    }
                },
            };
        case SET_CV_PERSONALITY:
            return {
                ...subState,
                cv: {
                    ...subState.cv,
                    [action.id]: {
                        ...subState.cv[action.id],
                        personality: {
                            [action.locale]: action.value
                        }
                    }
                },
            };
        case SET_CV_INTERESTS:
            return {
                ...subState,
                cv: {
                    ...subState.cv,
                    [action.id]: {
                        ...subState.cv[action.id],
                        interests: {
                            [action.locale]: action.value
                        }
                    }
                },
            };
        default:
            return subState
    }
};

export default reducer