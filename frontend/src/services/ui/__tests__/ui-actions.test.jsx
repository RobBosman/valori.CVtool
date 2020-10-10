import { reducerRegistry } from "../../../redux/reducerRegistry";
import * as uiActions from "../ui-actions";

describe("ui-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLocationHash", () => {
    const state = reducer(undefined, uiActions.setLocationHash("#xyz"));
    expect(state.ui.locationHash)
      .toBe("#xyz");
  });

  it("should reduce setLocale", () => {
    const state = reducer(undefined, uiActions.setLocale("de_DE"));
    expect(state.ui.locale)
      .toBe("de_DE");
  });

  it("should reduce setThemeName", () => {
    const state = reducer(undefined, uiActions.setThemeName("darkOrange"));
    expect(state.ui.themeName)
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

  it("should reduce setLastEditedTimestamp", () => {
    const timestamp = new Date("1970-04-01");
    const state = reducer(undefined, uiActions.setLastEditedTimestamp(timestamp));
    expect(state.ui.lastEditedTimestamp)
      .toBe(timestamp);
  });

  it("should reduce setLastSavedTimestamp", () => {
    const timestamp = new Date("1970-04-01");
    const state = reducer(undefined, uiActions.setLastSavedTimestamp(timestamp));
    expect(state.ui.lastSavedTimestamp)
      .toBe(timestamp);
  });
});