/**
 * @flow
 */

import Checks from './checks';
import { MissingInitialStateError } from './errors';

import type { Machine, MachineBuilder,
    State, StateId } from './types';

export class StandardMachine<T> implements Machine<T> {
    _contextClass: Class<T>;
    _initialState: State<T>;
    _states: $ReadOnlyArray<State<T>>;

    constructor (contextClass: Class<T>, initialState: State<T>,
        states: $ReadOnlyArray<State<T>>) {
        this._contextClass = contextClass;
        this._initialState = initialState;
        this._states = states;
    }

    initialState (): State<T> {
        return this._initialState;
    }

    run (context: T) {
    }

    states (): $ReadOnlyArray<State<T>> {
        return this._states;
    }
}

export class StandardMachineBuilder<T> implements MachineBuilder<T> {
    _contextClass: Class<T>;
    _initialState: ?State<T>;
    _states: Array<State<T>>;
    _stateIds: Set<StateId>;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._initialState = null;
        this._states = [];
        this._stateIds = new Set();
    }

    build (): Machine<T> {
        const initialState: State<T> = Checks.hasInitialState(this._initialState);

        Checks.noIllegalTransitions(this._states, this._stateIds);

        return new StandardMachine(this._contextClass, initialState, this._states);
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
