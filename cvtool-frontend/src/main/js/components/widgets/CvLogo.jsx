import { Stack } from "@fluentui/react";
import React from "react";
import ceriosLogoSvg from "../../static/Cerios-logo-full.svg";
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
    <img src={ceriosLogoSvg} alt="Cerios" width="120em" height="80em"/>
    <img src={cvtoolTextSvg} alt="CVtool" width="80em" height="80em"/>
  </Stack>
);

export default CvLogo;