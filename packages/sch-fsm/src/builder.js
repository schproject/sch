/**
 * @flow
 */

import Checks from './checks';
import { IllegalStateError } from './errors';

import type { Machine, MachineBuilder,
    State, StateBuilder, StateId, StateIdRegistry,
    Transition, TransitionFactory } from './types';

class ReferenceTrackingStateIdRegistry implements StateIdRegistry {
    _references: Set<StateId>;
    
    constructor () {
        this._references = new Set();
    }

    get (name: string): StateId {
        if (!this._references.has(name)) {
            this._references.add(name);
        }

        return name;
    }

    getReferences (): Iterator<StateId> {
        return this._references.values();
    }
}

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

        return new StandardMachine(this._contextClass,
            this._initialState, this._states.values());
    }

    state (state: State<T>): MachineBuilder<T> {
        Checks.duplicateStateId(this._states.keys(), state.id());
        Checks.singleInitialState(this._initialState, state.initial());

        this._states.set(state.id(), state);

        return this;
    }
}

class StandardState<T> implements State<T> {
    _id: StateId;
    _initial: boolean;
    _transition: Transition<T>;
    _transitionsTo: $ReadOnlyArray<StateId>;

    constructor (id: StateId, initial: boolean,
        transition: Transition<T>, transitionsTo: $ReadOnlyArray<StateId>) {
        this._id = id;
        this._initial = initial;
        this._transition = transition;
        this._transitionsTo = transitionsTo;
    }

    id (): StateId {
        return this._id;
    }

    initial (): boolean {
        return this._initial;
    }

    transition (): Transition<T> {
        return this._transition;
    }

    transitionsTo (): $ReadOnlyArray<StateId> {
        return this._transitionsTo;
    }
}

class StandardStateBuilder<T> implements StateBuilder<T> {
    _contextClass: Class<T>;
    _id: ?StateId;
    _initial: boolean;
    _transition: ?Transition<T>;
    _transitionsTo: Array<StateId>;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._transitionsTo = [];
    }

    build (): State<T> {
        if (!this._id)
            throw new IllegalStateError('Cannot build a state without an id');
        if (!this._transition)
            throw new IllegalStateError('Cannot build a state without a transition');

        return new StandardState(this._id, this._initial,
            this._transition, this._transitionsTo);
    }

    id (id: StateId): StateBuilder<T> {
        this._id = id;

        return this;
    }

    initial (): StateBuilder<T> {
        this._initial = true;

        return this;
    }

    transition (transitionFactory: TransitionFactory<T>): StateBuilder<T> {
        if (this._transition)
            throw new IllegalStateError('State builder transition is already set');

        const stateIdReferences = new ReferenceTrackingStateIdRegistry();

        this._transition = transitionFactory(stateIdReferences);

        for (let stateId: StateId of stateIdReferences.getReferences())
            this._transitionsTo.push(stateId);

        return this;
    }
}
