import reducerRegistry from "../../../redux/reducerRegistry";
import { setLocationHash, setThemeName, setLocale, selectSkillId, selectEducationId, selectCvId } from "../ui-actions";

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

  it("should reduce selectCvId", () => {
    const state = reducer(undefined, selectCvId(313));
    expect(state.ui.selected.cvId).toBe(313);
  });

  it("should reduce selectEducationId", () => {
    const state = reducer(undefined, selectEducationId(767));
    expect(state.ui.selected.educationId).toBe(767);
  });

  it("should reduce selectSkillId", () => {
    const state = reducer(undefined, selectSkillId(676));
    expect(state.ui.selected.skillId).toBe(676);
  });
});