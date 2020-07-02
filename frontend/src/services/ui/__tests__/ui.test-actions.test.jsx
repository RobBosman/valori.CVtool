import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setLocationHash, setThemeName, setLocale, setDialogConfig, setSelectedId } from "../ui-actions";

describe("ui", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLocationHash", () => {
    const state = reducer(undefined, setLocationHash("#xyz"));
    expect(state.ui.locationHash)
      .toBe("#xyz");
  });

  it("should reduce setLocale", () => {
    const state = reducer(undefined, setLocale("de_DE"));
    expect(state.ui.locale)
      .toBe("de_DE");
  });

  it("should reduce setThemeName", () => {
    const state = reducer(undefined, setThemeName("darkOrange"));
    expect(state.ui.themeName)
      .toBe("darkOrange");
  });

  it("should reduce setSelectedId", () => {
    const entityName1 = "education";
    const entityName2 = "skill";
    let state = reducer(undefined, setSelectedId(entityName1, 313));
    expect(state.ui.selectedId[entityName1])
      .toBe(313);
    expect(state.ui.selectedId[entityName2])
      .toBe(undefined);
      
    state = reducer(state, setSelectedId(entityName2, 767));
    expect(state.ui.selectedId[entityName1])
      .toBe(313);
    expect(state.ui.selectedId[entityName2])
      .toBe(767);
  });

  it("should reduce setDialogConfig", () => {
    const state = reducer(undefined, setDialogConfig("skill", { open: false, x: 767, y: 676 }));
    expect(state.ui.dialogConfig)
      .toStrictEqual({ skill: { open: false, x: 767, y: 676 } });
  });
});