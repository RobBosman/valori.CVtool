import React from 'react'
import Trumbowyg from "react-trumbowyg"
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
            onBlur={(event) => props.onChange(event.target.innerHTML)}
            tagsToRemove={['script', 'link']}
        />
    )
};

export default TrumbowygRTE