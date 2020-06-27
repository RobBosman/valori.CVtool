import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setLocationHash, setThemeName, setLocale, selectSkillId, selectEducationId, setSelectedCvId, setDialogConfig } from "../ui-actions";

describe("ui", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setLocationHash", () => {
    const state = reducer(undefined, setLocationHash("#xyz"));
    expect(state.ui.locationHash).toBe("#xyz");
  });

  it("should reduce setLocale", () => {
    const state = reducer(undefined, setLocale("de_DE"));
    expect(state.ui.locale).toBe("de_DE");
  });

  it("should reduce setThemeName", () => {
    const state = reducer(undefined, setThemeName("darkOrange"));
    expect(state.ui.themeName).toBe("darkOrange");
  });

  it("should reduce setSelectedCvId", () => {
    const state = reducer(undefined, setSelectedCvId(313));
    expect(state.ui.selectedCvId).toBe(313);
  });

  it("should reduce selectEducationId", () => {
    const state = reducer(undefined, selectEducationId(767));
    expect(state.ui.selectedEducationId).toBe(767);
  });

  it("should reduce selectSkillId", () => {
    const state = reducer(undefined, selectSkillId(676));
    expect(state.ui.selectedSkillId).toBe(676);
  });

  it("should reduce setDialogConfig", () => {
    const state = reducer(undefined, setDialogConfig("skill", { open: false, x: 767, y: 676 }));
    expect(state.ui.dialogConfig).toStrictEqual({ skill: { open: false, x: 767, y: 676 } });
  });
});