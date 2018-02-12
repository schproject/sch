/**
 * @flow
 */

export type StateId = string;

export interface StateIdRegistry {
    +get: string => StateId;
}

export type Executor<T> = T => ?StateId;

export type ExecutorFactory<T> = StateIdRegistry => Executor<T>;

export interface State<T> {
    +executor: (void) => Executor<T>;
    +id: (void) => StateId;
    +initial: (void) => boolean;
    +transitionsTo: (void) => $ReadOnlyArray<StateId>;
}

export interface StateBuilder<T> {
    +build: (void) => State<T>;
    +executor: (ExecutorFactory<T>) => StateBuilder<T>;
    +id: (StateId) => StateBuilder<T>;
    +initial: (void) => StateBuilder<T>;
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
