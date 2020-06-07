import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { setLocationHash } from "../ui-actions";
import darkOrange from "../../../themes/darkOrange";
import darkYellow from "../../../themes/darkYellow";
import lightBlue from "../../../themes/lightBlue";
import lightGreen from "../../../themes/lightGreen";
import { useTheme, initializeUI } from "../ui-services";
import { loadTheme } from "@fluentui/react";

describe("ui", () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("should initialize UI", () => new Promise((_resolve) => {
    initializeUI((action) => {
      expect(action).toStrictEqual(setLocationHash(""));
      _resolve();
    });
    window.dispatchEvent(new CustomEvent("unhandledrejection", { detail: "real thing" }));
    window.dispatchEvent(new CustomEvent("hashchange", {}));
  }));

  it("should useTheme", () => {
    const TestComp = () => {
      const { viewPaneColor } = useTheme();
      return (
        <div id="testTarget" style={{ background: viewPaneColor }} />
      );
    };

    act(() => {
      render(<TestComp />, container);
    });
    const testTarget = document.getElementById("testTarget");
    expect(testTarget.style.background)
      .toBe(colorToRgb(lightBlue.palette.neutralQuaternaryAlt));

    act(() => {
      loadTheme(darkOrange);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(darkOrange.palette.neutralQuaternaryAlt));

    act(() => {
      loadTheme(darkYellow);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(darkYellow.palette.neutralQuaternaryAlt));

    act(() => {
      loadTheme(lightGreen);
    });
    expect(testTarget.style.background)
      .toBe(colorToRgb(lightGreen.palette.neutralQuaternaryAlt));
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
