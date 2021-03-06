import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { loadTheme } from "@fluentui/react";
import fluentUITheme from "../../../static/themes/fluentUI.json";
import valoriBlueTheme from "../../../static/themes/valoriBlue.json";
import valoriOrangeTheme from "../../../static/themes/valoriOrange.json";
import * as uiServices from "../ui-services";

describe("ui-services.test", () => {

  let _container = null;

  beforeEach(() => {
    _container = document.createElement("div");
    document.body.appendChild(_container);
  });

  afterEach(() => {
    unmountComponentAtNode(_container);
    _container.remove();
    _container = null;
  });

  it("should useTheme", () => {
    const TestComp = () => {
      const {viewPaneBackground} = uiServices.useTheme();
      return (
        <div id="testTarget" style={{ background: viewPaneBackground}} />
      );
    };

    act(() => {
      render(<TestComp />, _container);
    });
    const testTarget = document.getElementById("testTarget");
    expect(testTarget.style.background)
      .toBe(colorToRgb(fluentUITheme.palette.neutralLighter));

    act(() => {
      loadTheme(valoriOrangeTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(valoriOrangeTheme.palette.neutralLighter));

    act(() => {
      loadTheme(valoriBlueTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(valoriBlueTheme.palette.neutralLighter));
  });
});

const colorToRgb = (color) => {
  if (color.startsWith("rgb(")) {
    return color;
  }
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  return `rgb(${r}, ${g}, ${b})`;
};
