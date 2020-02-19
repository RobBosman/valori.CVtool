import React from 'react'
import Trumbowyg from "react-trumbowyg"
import {setCvInteresses} from "../redux/ducks/CvContent"
import {connect} from "react-redux"
import 'react-trumbowyg/dist/trumbowyg.min.css'

// TODO: npx react-codemod rename-unsafe-lifecycles

/*
Plus:
klein, style werkt al aardig goed, html view, html output, mooie buttons, undo

Min:
paragraaf in tekst, export onBlur (niet onChange),
focus/selectie gaan verloren (saveRange?), unsafe lifecycles,
doorhalen injecteert paragraaf, fixed screen size
*/

const TrumbowygRTE = (props) => {
    return (
        <Trumbowyg
            id="react-trumbowyg"
            buttons={
                [
                    ['strong', 'em', 'del'],
                    ['unorderedList', 'orderedList'],
                    ['undo', 'redo'],
                    ['viewHTML']
                ]
            }
            minimalLinks={true}
            autogrowOnEnter={true}
            placeholder={props.placeholder}
            data={props.data}
            onBlur={(event) => props.onBlur(event.target.innerHTML)}
            tagsToRemove={['script', 'link']}
        />
    )
};

const mapStateToProps = (state) => ({
    data: state.cvContent.interesses
});

const mapDispatchToProps = (dispatch) => ({
    onBlur: (data) => dispatch(setCvInteresses(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(TrumbowygRTE)