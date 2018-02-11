import {
    DuplicateStateIdError,
    MultipleInitialStatesError
} from './errors';

import type { State } from './types';

export function duplicateStateId (stateIds: Iterable<StateId>, stateId: StateId): boolean {
    for (let id: StateId of stateIds) {
        if (id == stateId) {
            throw new DuplicateStateIdError(
                'There is already a state with id: '
                + stateId
            );
        }
    }

    return false;
}

export function notNull (value: any, error: Error): boolean {
    if (!value) throw error;
    return true;
}

export function singleInitialState<T> (state?: State<T>, initial: boolean): boolean {
    if (state && initial) {
        throw new MultipleInitialStatesError(
            'There is already an initial state with id: '
            + state.id()
        );
    }
    return true;
}

export default {
    duplicateStateId,
    notNull,
    singleInitialState
}
