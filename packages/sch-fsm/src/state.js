/**
 * @flow
 */

import Checks from './checks';
import { IllegalStateError } from './errors';
import { ReferenceTrackingStateIdRegistry } from './util';

import type { State, StateBuilder, StateId, StateIdRegistry,
    Transition, TransitionFactory } from './types';

export class StandardState<T> implements State<T> {
    _contextClass: Class<T>;
    _id: StateId;
    _initial: boolean;
    _transition: Transition<T>;
    _transitionsTo: $ReadOnlyArray<StateId>;

    constructor (contextClass: Class<T>, id: StateId, initial: boolean,
        transition: Transition<T>, transitionsTo: $ReadOnlyArray<StateId>) {
        this._contextClass = contextClass;
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

export class StandardStateBuilder<T> implements StateBuilder<T> {
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

        return new StandardState(this._contextClass, this._id, this._initial,
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
