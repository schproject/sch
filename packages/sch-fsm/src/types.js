/**
 * @flow
 */

export interface Machine<T> {
    +run: (context: T) => void;
}

export interface MachineBuilder<T> {
    +build: void => Machine<T>;
    +state: (State<T>) => MachineBuilder<T>;
}

export interface State<T> {
    +enter: (context: T) => StateId;
    +id: (void) => StateId;
}

export interface StateBuilder<T> {
    +build: void => State<T>;
    +id: (id: StateId) => StateBuilder<T>;
    +onEnter: (T => StateId) => StateBuilder<T>;
    +to: (...ids: Array<StateId>) => StateBuilder<T>;
}

export type StateFactory<T> = (idRegistry: StateIdRegistry) => State<T>; 

export interface StateId {
    +name: void => string;
}

export interface StateIdRegistry {
    +get: (name: string) => StateId;
    +has: (name: string) => boolean;
}

export type Transition = (nextStateId: StateId) => void;

//MachineBuilder.new()
//    init('parse-flag-or-value', step.impl(ParseFlagOrValueFactory(onFlag=builder.ref('parse-flag')))
