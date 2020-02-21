import React from "react"
import Editor from "@react-page/editor"
import "@react-page/core/lib/index.css"

import slate from "@react-page/plugins-slate" // The rich text area plugin
import "@react-page/plugins-slate/lib/index.css" // Stylesheets for the rich text area plugin

/*
Plus:
...

Min:
???
*/

const ReactPageRTE = (props) => {

    const plugins = {
        content: [slate()]
    };

    return (
        <Editor plugins={plugins} value={props.value} onChange={props.onChange} readOnly/>
    )
};

export default ReactPageRTE