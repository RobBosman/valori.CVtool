import React from "react"
import "./Title.scss"
import valoriName from '../static/valori-name.png';

const Title = (props) => (
    <span className="Title"><img src={valoriName} alt="Valori" height={props.height}/> <b>CVtool</b></span>
);

export default Title