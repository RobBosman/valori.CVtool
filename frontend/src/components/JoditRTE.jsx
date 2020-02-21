import React from "react"
import JoditEditor from "jodit-react"
import {getTheme, registerOnThemeChangeCallback} from "office-ui-fabric-react"

/*
Plus:
works nice!, auto-scroll, HTML editable

Min:
not responding to theme (unless 'inline')
inline: scrollbar?, offset?, no border?
*/

const overrideJoditTheme = (theme) => {
    document
        .querySelectorAll(".jodit_default_theme")
        .forEach(element => element.style.background = theme.semanticColors.bodyBackground);
    document
        .querySelectorAll(".jodit_default_theme .jodit_toolbar svg")
        .forEach(element => element.style.fill = theme.semanticColors.buttonText);
};

registerOnThemeChangeCallback(overrideJoditTheme);

const JoditRTE = (props) => {

    React.useEffect(() => {
        overrideJoditTheme(getTheme());
    });

    const config = {
        // all options from https://xdsoft.net/jodit/doc/
        readonly: false,
        toolbar: true,
        buttons: [
            'bold', 'strikethrough', 'underline', 'italic', 'eraser',
            '|', 'superscript', 'subscript',
            '|', 'ul', 'ol',
            '|', 'outdent', 'indent',
            '|', 'undo', 'redo',
            '|', 'source'
        ],
        enableDragAndDropFileToEditor: false,
        useSearch: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        placeholder: props.placeholder,
        style: {
            font: '16px Arial'
        }
    };

    return (
        <JoditEditor value={props.value}
                     onBlur={props.onChange}
                     config={config}/>
    )
};

export default JoditRTE