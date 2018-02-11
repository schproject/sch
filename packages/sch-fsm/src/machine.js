/**
 * @flow
 */

import Checks from './checks';
import { IllegalStateError, MissingInitialStateError } from './errors';

import type { Machine, MachineBuilder,
    State, StateId } from './types';

export class StandardMachine<T> implements Machine<T> {
    _contextClass: Class<T>;
    _initialState: State<T>;
    _states: Iterator<State<T>>;

    constructor (contextClass: Class<T>, initialState: State<T>,
        states: Iterator<State<T>>) {
        this._contextClass = contextClass;
        this._initialState = initialState;
        this._states = states;
    }

    run (context: T) {
    }
}

export class StandardMachineBuilder<T> implements MachineBuilder<T> {
    _contextClass: Class<T>;
    _initialState: ?State<T>;
    _stateIds: Set<StateId>;
    _states: Array<State<T>>;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._initialState = null;
        this._stateIds = new Set();
        this._states = [];
    }

    build (): Machine<T> {
        const initialState: State<T> = Checks.hasInitialState(this._initialState),
            states = Checks.noIllegalStates(this._states);

        return new StandardMachine(this._contextClass, initialState, states);
    }

    state (state: State<T>): MachineBuilder<T> {
        Checks.duplicateStateId(this._stateIds, state.id());
        Checks.singleInitialState(this._initialState, state.initial());

        if(state.initial()) {
            this._initialState = state;
        }

        this._stateIds.add(state.id());
        this._states.push(state);

        return this;
    }
}
