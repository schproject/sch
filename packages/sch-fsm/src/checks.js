import {
    DuplicateStateIdError,
    MultipleInitialStatesError
} from './errors';

import type { State } from './types';

export function duplicateStateId (stateIds: Iterable<StateId>, stateId: StateId) {
    for (let id: StateId of stateIds) {
        if (id == stateId) {
            throw new DuplicateStateIdError(
                'There is already a state with id: '
                + stateId
            );
        }
    }
}

export function notNull (value: any, error: Error) {
    if (!value) throw error;
}

export function singleInitialState<T> (state?: State<T>, initial: boolean) {
    if (state && initial) {
        throw new MultipleInitialStatesError(
            'There is already an initial state with id: '
            + state.id()
        );
    }
}

export default {
    duplicateStateId,
    notNull,
    singleInitialState
}
