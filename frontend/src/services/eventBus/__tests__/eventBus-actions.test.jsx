import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setEventBusConnectionState } from "../eventBus-actions";
import { EventBusConnectionStates } from "../eventBus-services";

describe("eventBus-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setEventBusConnectionState[0]", () => {
    let state = reducer(undefined, setEventBusConnectionState(EventBusConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISCONNECTED);
  });

  it("should reduce setEventBusConnectionState[1]", () => {
    let state = reducer(undefined, setEventBusConnectionState(EventBusConnectionStates.CONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.CONNECTING);
    
    state = reducer(state, setEventBusConnectionState(EventBusConnectionStates.CONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.CONNECTED);
  });

  it("should reduce setEventBusConnectionState[2]", () => {
    let state = reducer(undefined, setEventBusConnectionState(EventBusConnectionStates.DISCONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISCONNECTING);
    
    state = reducer(state, setEventBusConnectionState(EventBusConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(EventBusConnectionStates.DISCONNECTED);
  });
});
