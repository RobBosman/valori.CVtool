import React from "react"
import valoriNameImg from '../static/valori-name.png'
import {Text} from "office-ui-fabric-react"

const Title = (props) => (
    <Text variant="xxLarge" style={{color: "#999999", whiteSpace: "nowrap"}}>
        <img src={valoriNameImg} alt="Valori" height={props.height}/> <b>CVtool</b>
    </Text>
);

export default Title