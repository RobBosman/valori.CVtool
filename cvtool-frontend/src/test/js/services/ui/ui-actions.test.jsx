/**
 * @jest-environment jsdom
 */
import { reducerRegistry } from "../../../../main/js/redux/reducerRegistry";
import * as uiActions from "../../../../main/js/services/ui/ui-actions";

describe("ui-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLocale", () => {
    const state = reducer(undefined, uiActions.setLocale("de_DE"));
    expect(state.ui.userPrefs.locale)
      .toBe("de_DE");
  });

  it("should reduce setTheme", () => {
    const state = reducer(undefined, uiActions.setTheme("darkOrange"));
    expect(state.ui.userPrefs.theme)
      .toBe("darkOrange");
  });

  it("should reduce setSelectedId", () => {
    const entityName1 = "education";
    const entityName2 = "skill";
    let state = reducer(undefined, uiActions.setSelectedId(entityName1, 313));
    expect(state.ui.selectedId[entityName1])
      .toBe(313);
    expect(state.ui.selectedId[entityName2])
      .toBe(undefined);
      
    state = reducer(state, uiActions.setSelectedId(entityName2, 767));
    expect(state.ui.selectedId[entityName1])
      .toBe(313);
    expect(state.ui.selectedId[entityName2])
      .toBe(767);
  });
});