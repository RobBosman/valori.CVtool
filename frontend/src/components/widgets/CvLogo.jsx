import { Stack } from "@fluentui/react";
import React from "react";
import valorLogoSvg from "../../static/Valori-logo.svg";
import cvtoolTextSvg from "../../static/CVtool-text.svg";
import {appVersion} from "../../app";

const logoStyles = {
  root: [
    {
      paddingLeft: 20,
      paddingTop: 20
    }
  ]
};
const versionStyle = {
  position: "fixed",
  right: 10,
  bottom: 10,
  fontSize: "small",
  color: "#888888"
};

const CvLogo = () => (
  <Stack horizontal
    tokens={{ childrenGap: "10" }}
    styles={logoStyles}>
    <img src={valorLogoSvg} alt="Valori" width="70em" height="70em"/>
    <img src={cvtoolTextSvg} alt="CVtool" width="70em" height="70em"/>
    <div style={versionStyle}><em>v{appVersion()}</em></div>
  </Stack>
);

export default CvLogo;