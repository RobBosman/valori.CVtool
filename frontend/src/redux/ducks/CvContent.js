"use strict";

const SET_CV_CONTENT = "SET_CV_CONTENT";

export const setCvContent = (value) => ({type: SET_CV_CONTENT, payload: value});

const reducer = (subState = "", action) => (
    action.type === SET_CV_CONTENT
        ? action.payload
        : subState
);
export default reducer