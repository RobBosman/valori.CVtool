/**
 * @jest-environment jsdom
 */
window.IS_REACT_ACT_ENVIRONMENT = true;

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { loadTheme } from "@fluentui/react";
import fluentUITheme from "../../../../main/js/static/themes/fluentUI.json";
import ceriosBlueTheme from "../../../../main/js/static/themes/ceriosBlue.json";
import ceriosOrangeTheme from "../../../../main/js/static/themes/ceriosOrange.json";
import * as uiServices from "../../../../main/js/services/ui/ui-services";

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
      loadTheme(ceriosOrangeTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(ceriosOrangeTheme.palette.neutralLighter));

    act(() => {
      loadTheme(ceriosBlueTheme);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(ceriosBlueTheme.palette.neutralLighter));
  });
});

const colorToRgb = (color) => {
  if (color.startsWith("rgb(")) {
    return color;
  }
  const r = Number.parseInt(color.substring(1, 3), 16);
  const g = Number.parseInt(color.substring(3, 5), 16);
  const b = Number.parseInt(color.substring(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};
