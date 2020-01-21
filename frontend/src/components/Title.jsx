'use strict';

import React from "react";
import './Title.scss';

export function TitleCerios(props) {
    return (
        <del className='TitleCerios'>Cerios</del>
    );
}

export function TitleValori(props) {
    return (
        <span className='TitleValori'>VALORI</span>
    );
}

export function TitleCVtool(props) {
    return (
        <span><TitleCerios/> <TitleValori/> CVtool</span>
    );
}