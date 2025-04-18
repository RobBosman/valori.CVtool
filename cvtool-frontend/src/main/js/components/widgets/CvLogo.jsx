import { Stack } from "@fluentui/react";
import React from "react";
import valorLogoSvg from "../../static/Valori-logo.svg";
import cvtoolTextSvg from "../../static/CVtool-text.svg";

const logoStyles = {
  root: {
    paddingLeft: 20,
    paddingTop: 20
  }
};

const CvLogo = () => (
  <Stack horizontal
    tokens={{ childrenGap: "10" }}
    styles={logoStyles}>
    <img src={valorLogoSvg} alt="Valori" width="70em" height="70em"/>
    <img src={cvtoolTextSvg} alt="CVtool" width="70em" height="70em"/>
  </Stack>
);

export default CvLogo;