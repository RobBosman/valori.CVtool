import React from "react"
import JoditEditor from "jodit-react";

/*
Plus:
works nice!, auto-scroll, HTML editable

Min:
not responding to theme (unless 'inline')
inline: scrollbar?
*/

const JoditRTE = (props) => {

    const config = {
        // all options from https://xdsoft.net/jodit/doc/
        readonly: false,
        enableDragAndDropFileToEditor: false,
        toolbar: true,
        height: 200,
        useSearch: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        buttons: [
            'bold',
            'strikethrough',
            'underline',
            'italic',
            'eraser',
            '|',
            'superscript',
            'subscript',
            '|',
            'ul',
            'ol',
            '|',
            'outdent',
            'indent',
            '|',
            'undo',
            'redo',
            '|',
            'source'
        ],
        placeholder: "type maar wat"
    };

    return (
        <JoditEditor style={{textAlign: "center", border: "1px solid #DDD"}}
                     value={props.value}
                     onBlur={props.onChange}
                     config={config}/>
    )
};

export default JoditRTE