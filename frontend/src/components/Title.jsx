"use strict";

import React from "react";
import "./Title.scss";

export default function Title(props) {
    return (
        <span className="Title"><img src="../../static/valori-name.png" alt="Valori"
                                     height={props.height}/> <b>CVtool</b></span>
    );
}