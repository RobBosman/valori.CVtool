import { reducerRegistry } from "../../../redux/reducerRegistry";
import { ConnectionStates } from "../eventBus-services";
import * as eventBusActions from "../eventBus-actions";

describe("eventBus-actions.test", () => {

  const reducer = reducerRegistry.getRootReducer();

  it("should reduce setEventBusConnectionState[0]", () => {
    let state = reducer(undefined, eventBusActions.setEventBusConnectionState(ConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTED);
  });

  it("should reduce setEventBusConnectionState[1]", () => {
    let state = reducer(undefined, eventBusActions.setEventBusConnectionState(ConnectionStates.CONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.CONNECTING);
    
    state = reducer(state, eventBusActions.setEventBusConnectionState(ConnectionStates.CONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.CONNECTED);
  });

  it("should reduce setEventBusConnectionState[2]", () => {
    let state = reducer(undefined, eventBusActions.setEventBusConnectionState(ConnectionStates.DISCONNECTING));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTING);
    
    state = reducer(state, eventBusActions.setEventBusConnectionState(ConnectionStates.DISCONNECTED));
    expect(state.eventBus.connectionState)
      .toBe(ConnectionStates.DISCONNECTED);
  });
});
