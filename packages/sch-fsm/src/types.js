/**
 * @flow
 */

export interface Machine<T> {
    +run: T => void;
}

export interface MachineBuilder<T> {
    +build: void => Machine<T>;
}

export interface State<T> {
    +enter: T => void;
}

export type StateFactory<T> = (idRegistry: StateIdRegistry) => State<T>; 

export interface StateId {
    +name: void => string;
}

export interface StateIdRegistry {
    +get: (name: string) => StateId;
    +has: (name: string) => boolean;
}

//MachineBuilder.new()
//    init('parse-flag-or-value', step.impl(ParseFlagOrValueFactory(onFlag=builder.ref('parse-flag')))
