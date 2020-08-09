import { reducerRegistry } from "../../../redux/reducerRegistry";
import { setEventBusConnectionState } from "../eventBus-actions";
import { ConnectionStates } from "../eventBus-services";

describe("eventBus-actions", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setEventBusConnectionState[0]", () => {
    let state = reducer(undefined, setEventBusConnectionState(ConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTED);
  });

  it("should reduce setEventBusConnectionState[1]", () => {
    let state = reducer(undefined, setEventBusConnectionState(ConnectionStates.CONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.CONNECTING);
    
    state = reducer(state, setEventBusConnectionState(ConnectionStates.CONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.CONNECTED);
  });

  it("should reduce setEventBusConnectionState[2]", () => {
    let state = reducer(undefined, setEventBusConnectionState(ConnectionStates.DISCONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTING);
    
    state = reducer(state, setEventBusConnectionState(ConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTED);
  });
});
