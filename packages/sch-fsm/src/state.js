/**
 * @flow
 */

import Checks from './checks';
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
        const id: StateId = Checks.hasStateId(this._id),
            transition: Transition<T> = Checks.hasTransition(this._transition);

        return new StandardState(this._contextClass, id, this._initial,
            transition, this._transitionsTo);
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
        Checks.transitionNotSet(this._transition);

        const stateIdReferences = new ReferenceTrackingStateIdRegistry();

        this._transition = transitionFactory(stateIdReferences);

        for (let stateId: StateId of stateIdReferences.getReferences())
            this._transitionsTo.push(stateId);

        return this;
    }
}
