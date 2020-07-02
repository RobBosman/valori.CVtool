import { reducerRegistry } from "../../../redux/reducerRegistry";
import { EventBusConnectionStates, updateEventBusConnectionState } from "../eventBus-actions";

describe("eventBus-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce updateEventBusConnectionStat[0]", () => {
    let state = reducer(undefined, updateEventBusConnectionState(EventBusConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISCONNECTED);
  });

  it("should reduce updateEventBusConnectionState[1]", () => {
    let state = reducer(undefined, updateEventBusConnectionState(EventBusConnectionStates.CONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.CONNECTING);
    
    state = reducer(state, updateEventBusConnectionState(EventBusConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.CONNECTING); // no change expected
  });

  it("should reduce updateEventBusConnectionState[2]", () => {
    let state = reducer(undefined, updateEventBusConnectionState(EventBusConnectionStates.DISCONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISCONNECTING);
    
    state = reducer(state, updateEventBusConnectionState(EventBusConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISABLED);
  });
});
