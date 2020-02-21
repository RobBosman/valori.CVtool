import React from "react";
import SunEditor from "suneditor-react/SunEditor"
import 'suneditor/dist/css/suneditor.min.css'

// TODO: fix node_modules/suneditor-react/SunEditor.js 139:11
// return React.createElement('textarea', {id: this.state.id, cols: '30', rows: '10'});

/*
Plus:
popup menu

Min:
updating content resets cursor position
auto-scroll instead of auto-size
...
*/

const SunEditorRTE = (props) => {
    const options = {
        height: 100,
        buttonList: [
            ["bold", "italic", "strike", "subscript", "superscript"],
            ["list"],
            ["undo", "redo"]
        ],
        showPathLabel: false,
        mode: "inline"
    };

    return (
        <SunEditor setOptions={options}
                   setContents={props.value}
                   onChange={props.onChange}/>
    )
};

export default SunEditorRTE