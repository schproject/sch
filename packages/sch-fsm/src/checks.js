/**
 * @flow
 */

import {
    DuplicateStateIdError,
    ExecutorAlreadyDefinedError,
    IllegalTransitionError,
    MissingIdError,
    MissingInitialStateError,
    MissingExecutorError,
    MultipleInitialStatesError
} from './errors';

import type { Executor, State, StateId } from './types';

export function duplicateStateId (stateIds: Set<StateId>, stateId: StateId): boolean {
    if(stateIds.has(stateId))
        throw new DuplicateStateIdError(
            'There is already a state with id: '
            + stateId
        );

    return false;
}

export function executorNotSet<T>(executor: ?Executor<T>) {
    if(executor)
        throw new ExecutorAlreadyDefinedError('State builder executor is already set');
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

export function hasExecutor<T>(transition: ?Executor<T>): Executor<T> {
    if(!transition) throw new MissingExecutorError('Missing required transition');
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

export default {
    executorNotSet,
    duplicateStateId,
    hasInitialState,
    hasStateId,
    hasExecutor,
    noIllegalTransitions,
    singleInitialState
}
