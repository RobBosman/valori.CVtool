import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import reducerRegistry from '../../../redux/reducerRegistry';
import { setLocationHash, setThemeName, setLocale, selectSkillId, selectEducationId, selectCvId } from '../ui-actions';
import lightBlue from '../../../themes/lightBlue';
import darkOrange from '../../../themes/darkOrange';
import { useTheme } from '../ui-services';
import { loadTheme } from '@fluentui/react';

describe('ui', () => {

  let container = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('should reduce', () => {
    const reducer = reducerRegistry.getRootReducer();

    let state = reducer(undefined, setLocationHash('#xyz'));
    expect(state.ui.locationHash).toBe('#xyz');

    state = reducer(undefined, setLocale('de_DE'));
    expect(state.ui.locale).toBe('de_DE');

    state = reducer(undefined, setThemeName('darkOrange'));
    expect(state.ui.themeName).toBe('darkOrange');

    state = reducer(undefined, selectCvId(313));
    expect(state.ui.selected.cvId).toBe(313);

    state = reducer(undefined, selectEducationId(767));
    expect(state.ui.selected.educationId).toBe(767);

    state = reducer(undefined, selectSkillId(676));
    expect(state.ui.selected.skillId).toBe(676);
  });

  it('should useTheme', async () => {

    const TestComp = () => {
      const { viewPaneColor } = useTheme();
      return (
        <div id="testTarget" style={{ background: viewPaneColor }} />
      )
    }

    act(() => {
      render(<TestComp />, container);
    });
    expect(document.getElementById("testTarget").style.background)
      .toBe('rgb(225, 223, 221)'); // lightBlue.palette.neutralQuaternaryAlt

    act(() => {
      loadTheme(darkOrange);
    });
    expect(document.getElementById("testTarget").style.background)
      .toBe('rgb(70, 68, 66)'); // darkOrange.palette.neutralQuaternaryAlt
  });
});
