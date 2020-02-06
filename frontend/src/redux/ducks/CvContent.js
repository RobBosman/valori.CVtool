"use strict";

import RichTextEditor from "react-rte"

const SET_CV_CONTENT = "SET_CV_CONTENT";

export const setCvContent = (value) => ({type: SET_CV_CONTENT, payload: value});

const reducer = (state = RichTextEditor.createEmptyValue(), action) => (
    action.type === SET_CV_CONTENT ? action.payload : state
);
export default reducer