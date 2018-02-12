/**
 * @flow
 */

export type StateId = string;

export interface StateIdRegistry {
    +get: string => StateId;
}

export type Transition<T> = T => StateId;

export type TransitionFactory<T> = StateIdRegistry => Transition<T>;

export interface State<T> {
    +id: (void) => StateId;
    +initial: (void) => boolean;
    +transition: (void) => Transition<T>;
    +transitionsTo: (void) => $ReadOnlyArray<StateId>;
}

export interface StateBuilder<T> {
    +build: (void) => State<T>;
    +id: (StateId) => StateBuilder<T>;
    +initial: (void) => StateBuilder<T>;
    +transition: (TransitionFactory<T>) => StateBuilder<T>;
}

export interface Machine<T> {
    +initialState: (void) => State<T>;
    +run: (context: T) => void;
    +states: (void) => $ReadOnlyArray<State<T>>;
}

export interface MachineBuilder<T> {
    +build: void => Machine<T>;
    +state: (state: State<T>) => MachineBuilder<T>;
}
