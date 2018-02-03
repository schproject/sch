/**
 * @flow
 */

import Checks from './checks';
import { IllegalStateError } from './errors';

import type { Machine, MachineBuilder,
    State, StateId } from './types';

class StandardMachine<T> implements Machine<T> {
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

class StandardMachineBuilder<T> implements MachineBuilder<T> {
    _contextClass: Class<T>;
    _initialState: ?State<T>;
    _states: Map<StateId, State<T>>;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._initialState = null;
        this._states = new Map();
    }

    build (): Machine<T> {
        if (!this._initialState)
            return new IllegalStateError('Cannot build a machine without an initial state');
        const initialState = this._initialState;

        this._states.forEach((state: State<T>) => {
            state.transitionsTo.forEach((stateId: StateId) => {
                if (!this._states.has(stateId)) {
                    throw new IllegalStateError(
                        'State ' + state.id() + ' transitions to' + stateId
                        + ', but no state with that id has been defined'
                    );
                }
            });
        });

        return new StandardMachine(this._contextClass, initialState, this._states.values());
    }

    state (state: State<T>): MachineBuilder<T> {
        Checks.duplicateStateId(this._states.keys(), state.id());
        Checks.singleInitialState(this._initialState, state.initial());

        this._states.set(state.id(), state);

        return this;
    }
}
