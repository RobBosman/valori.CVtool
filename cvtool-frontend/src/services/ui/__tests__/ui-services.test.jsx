/**
 * @jest-environment jsdom
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { loadTheme } from "@fluentui/react";
import fluentUITheme from "../../../static/themes/fluentUI.json";
import valoriBlueTheme from "../../../static/themes/valoriBlue.json";
import valoriOrangeTheme from "../../../static/themes/valoriOrange.json";
import * as uiServices from "../ui-services";

describe("ui-services.test", () => {

  let _container = null;
  let _reactRoot = null;

  beforeEach(() => {
    _container = document.createElement("div");
    document.body.appendChild(_container);
    _reactRoot = createRoot(_container);
  });

  afterEach(() => {
    act(() => {
      _reactRoot.unmount();
    });
    _reactRoot = null;
    _container.remove();
    _container = null;
  });

  it("should useTheme", () => {
    const TestComp = () => {
      const {viewPaneBackground} = uiServices.useTheme();
      return (
        <div id="testTarget" style={{ background: viewPaneBackground }} />
      );
    };

    act(() => {
      _reactRoot.render(<TestComp />);
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
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};
