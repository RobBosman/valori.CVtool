import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { loadTheme } from "@fluentui/react";
import lightBlueTheme from "../../../static/themes/lightBlue.json";
import lightGreenTheme from "../../../static/themes/lightGreen.json";
import darkOrangeTheme from "../../../static/themes/darkOrange.json";
import darkYellowTheme from "../../../static/themes/darkYellow.json";
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
      const { viewPaneColor } = uiServices.useTheme();
      return (
        <div id="testTarget" style={{ background: viewPaneColor }} />
      );
    };

    act(() => {
      render(<TestComp />, _container);
    });
    const testTarget = document.getElementById("testTarget");
    expect(testTarget.style.background)
      .toBe(colorToRgb(lightBlueTheme.palette.neutralLighter));

    act(() => {
      loadTheme(darkOrangeTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(darkOrangeTheme.palette.neutralLighter));

    act(() => {
      loadTheme(darkYellowTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(darkYellowTheme.palette.neutralLighter));

    act(() => {
      loadTheme(lightGreenTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(lightGreenTheme.palette.neutralLighter));
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
