/**
 * @flow
 */

import Checks from './checks';
import { ReferenceTrackingStateIdRegistry } from './util';

import type { Executor, ExecutorFactory,
  State, StateBuilder, StateId, StateIdRegistry} from './types';

export class StandardState<T> implements State<T> {
    _contextClass: Class<T>;
    _executor: Executor<T>;
    _id: StateId;
    _initial: boolean;
    _transitionsTo: $ReadOnlyArray<StateId>;

    constructor (contextClass: Class<T>, executor: Executor<T>, id: StateId,
      initial: boolean, transitionsTo: $ReadOnlyArray<StateId>) {
        this._contextClass = contextClass;
        this._executor = executor;
        this._id = id;
        this._initial = initial;
        this._transitionsTo = transitionsTo;
    }

    executor (): Executor<T> {
      return this._executor;
    }

    id (): StateId {
        return this._id;
    }

    initial (): boolean {
        return this._initial;
    }

    transitionsTo (): $ReadOnlyArray<StateId> {
        return this._transitionsTo;
    }
}

export class StandardStateBuilder<T> implements StateBuilder<T> {
    _contextClass: Class<T>;
    _executor: ?Executor<T>;
    _id: ?StateId;
    _initial: boolean;
    _transitionsTo: Array<StateId>;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._transitionsTo = [];
    }

    build (): State<T> {
        const executor: Executor<T> = Checks.hasExecutor(this._executor),
          id: StateId = Checks.hasStateId(this._id);

        return new StandardState(this._contextClass, executor, id,
          this._initial, this._transitionsTo);
    }

    executor (executorFactory: ExecutorFactory<T>): StateBuilder<T> {
        Checks.executorNotSet(this._executor);

        const stateIdReferences = new ReferenceTrackingStateIdRegistry();

        this._executor = executorFactory(stateIdReferences);

        for (let stateId: StateId of stateIdReferences.getReferences())
            this._transitionsTo.push(stateId);

        return this;
    }
    id (id: StateId): StateBuilder<T> {
        this._id = id;

        return this;
    }

    initial (): StateBuilder<T> {
        this._initial = true;

        return this;
    }
}
