import React from "react"
import "./Title.css"
import valoriNameImg from '../static/valori-name.png';

const Title = (props) => (
    <span className="Title"><img src={valoriNameImg} alt="Valori" height={props.height}/> <b>CVtool</b></span>
);

export default Title