import { Stack } from "@fluentui/react";
import React from "react";
import ceriosLogoSvg from "../../static/Cerios-logo-full.svg";
import cvtoolTextSvg from "../../static/CVtool-text.svg";

const logoStyles = {
  root: {
    paddingLeft: 5,
    paddingTop: 39
  }
};

const CvLogo = () => (
  <Stack horizontal
    tokens={{ childrenGap: "0" }}
    styles={logoStyles}>
    <img src={ceriosLogoSvg} alt="Cerios" width="120em" height="60em"/>
    <img src={cvtoolTextSvg} alt="CVtool" width="80em" height="60em"/>
  </Stack>
);

export default CvLogo;