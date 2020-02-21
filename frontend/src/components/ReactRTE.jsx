import React from 'react'
import RichTextEditor from 'react-rte'

// TODO: npx react-codemod rename-unsafe-lifecycles

/*
Plus:
klein, onChange, undo, focus/selectie blijven behouden, autoGrow/Shrink

combi van Redux en React state om content en focus/selectie apart bij te houden(?)

Min:
style werkt niet(?), geen html view, geen html output, minder mooie buttons,
unsafe lifecycles, specifieke initial state
*/

const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
    ]
};

const ReactRTE = (props) => {
    // const [editorValue, setEditorValue] = useState(RichTextEditor.createEmptyValue());
    // const onChangeCB = useCallback((value) => {
    //     props.onChange(value)
    // }, [editorValue.toString()]);
    return (
        <RichTextEditor
            value={props.value}
            onChange={props.onChange}
            toolbarConfig={toolbarConfig}
            readOnly={props.readOnly}
            placeholder={props.placeholder}
            autoFocus={true}/>
    )
};

export default ReactRTE