import reducerRegistry from "../../../redux/reducerRegistry";
import { EventBusConnectionStates, updateEventBusConnectionState } from "../eventBus-actions";

describe("eventBus", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce", () => {
    let state = reducer(undefined, updateEventBusConnectionState(EventBusConnectionStates.CONNECTING));
    expect(state.eventBus.connectionState).toBe(EventBusConnectionStates.CONNECTING);

    state = reducer(state, updateEventBusConnectionState(EventBusConnectionStates.CLOSED));
    expect(state.eventBus.connectionState).toBe(EventBusConnectionStates.CONNECTING); // no change expected

    state = reducer(state, updateEventBusConnectionState(EventBusConnectionStates.CLOSING));
    expect(state.eventBus.connectionState).toBe(EventBusConnectionStates.CLOSING);

    state = reducer(state, updateEventBusConnectionState(EventBusConnectionStates.CLOSED));
    expect(state.eventBus.connectionState).toBe(EventBusConnectionStates.DISABLED);
  });
});
