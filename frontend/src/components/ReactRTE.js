import React from 'react'
import RichTextEditor from 'react-rte'
import {setCvContent} from "../redux/ducks/CvContent"
import {connect} from "react-redux"

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

const ReactRTE = (props) => (
    <RichTextEditor
        toolbarConfig={toolbarConfig}
        value={props.value}
        onChange={props.onChange}/>
);

const mapStateToProps = (state) => ({
    value: state.cvContent
});

const mapDispatchToProps = (dispatch) => ({
    onChange: (value) => dispatch(setCvContent(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReactRTE)