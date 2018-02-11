/**
 * @flow
 */

import {
    DuplicateStateIdError,
    IllegalTransitionError,
    MissingIdError,
    MissingInitialStateError,
    MissingTransitionError,
    MultipleInitialStatesError,
    TransitionAlreadyDefinedError
} from './errors';

import type { State, StateId, Transition } from './types';

export function duplicateStateId (stateIds: Set<StateId>, stateId: StateId): boolean {
    if(stateIds.has(stateId))
        throw new DuplicateStateIdError(
            'There is already a state with id: '
            + stateId
        );

    return false;
}

export function hasInitialState<T>(state: ?State<T>): State<T> {
    if (!state)
        throw new MissingInitialStateError('Missing initial state');
    return state;
}

export function hasStateId (stateId: ?StateId): StateId {
    if(!stateId) throw new MissingIdError('Missing required state id');
    return stateId;
}

export function hasTransition<T>(transition: ?Transition<T>): Transition<T> {
    if(!transition) throw new MissingTransitionError('Missing required transition');
    return transition;
}

export function noIllegalTransitions<T>(states: $ReadOnlyArray<State<T>>, transitions: Set<StateId>) {
    return states.map((state: State<T>) => {
        state.transitionsTo().forEach((transition: StateId) => {
            if (transitions.has(transition)) return;
            throw new IllegalTransitionError(
                'State ' + state.id() + ' transitions to' + transition
                + ', but no state with that id has been defined'
            );
        });
    });
}

export function singleInitialState<T> (state: ?State<T>, initial: boolean): boolean {
    if (state && initial) {
        throw new MultipleInitialStatesError(
            'There is already an initial state with id: '
            + state.id()
        );
    }
    return true;
}

export function transitionNotSet<T>(transition: ?Transition<T>) {
    if(transition)
        throw new TransitionAlreadyDefinedError('State builder transition is already set');
}

export default {
    duplicateStateId,
    hasInitialState,
    hasStateId,
    hasTransition,
    noIllegalTransitions,
    singleInitialState,
    transitionNotSet
}
