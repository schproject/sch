/**
 * @flow
 */

import type { Machine, MachineBuilder,
    State, StateBuilder,
    StateId, StateIdRegistry } from './types';

class StandardMachineBuilder<T> implements MachineBuilder<T> {
    _contextClass: Class<T>;
    _states: Map<StateId, State<T>>;
    _stateIdRefs: StateIdRegistry;

    constructor (contextClass: Class<T>,
            stateIdRefs: StateIdRegistry = new MutableStateIdRegistry()) {
        this._contextClass = contextClass;
        this._states = new Map();
        this._stateIdRefs = stateIdRefs;
    }

    build (): Machine<T> {
        return { 
            run() {}
        }
    }

    state (state: State<T>): MachineBuilder<T> {
        if (this._states.has(state.id())) {
            throw new Error('There is already a state with id: ' + state.id().name());
        }

        this._states.set(state.id(), state);

        return this;
    }
}

class StandardState<T> implements State<T> {
    _id: StateId;
    _onEnter: T => StateId;
    _to: StateIdRegistry;

    constructor (id: StateId, onEnter: T => StateId, to: StateIdRegistry) {
        this._id = id;
        this._onEnter = onEnter;
        this._to = to;
    }

    enter (context: T): StateId {
        const stateId = this._onEnter(context);

        return stateId;
    }

    id (): StateId {
        return this._id;
    }

    to (): StateIdRegistry {
        return this._to;
    }
}

class StandardStateBuilder<T> implements StateBuilder<T> {
    _contextClass: Class<T>;
    _id: StateId;
    _onEnter: T => StateId;
    _to: StateIdRegistry;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._to = new MutableStateIdRegistry();
    }

    build (): State<T> {
        return new StandardState(this._id, this._onEnter,
            new ImmutableStateIdRegistry(this._to));
    }

    id (id: StateId): StateBuilder<T> {
        this._id = id;
        return this;
    }

    onEnter (onEnter: T => StateId): StateBuilder<T> {
        this._onEnter = onEnter;

        return this;
    }

    to (...ids: Array<StateId>): StateBuilder<T> {
        let i;
        for (i = 0; i < ids.length; i++)
            this._to.get(ids[i].name());
        return this;
    }
}

class StandardStateId implements StateId {
    _name: string;

    constructor (name: string) {
        this._name = name;
    }

    name (): string {
        return this._name;
    }
}

class ImmutableStateIdRegistry implements StateIdRegistry {
    _innerRegistry: StateIdRegistry;

    constructor (innerRegistry: StateIdRegistry) {
        this._innerRegistry = innerRegistry;
    }

    get (name: string): StateId {
        if (!this._innerRegistry.has(name))
            throw new Error('No id found with name: ' + name);

        return this._innerRegistry.get(name);
    }

    has (name: string): boolean {
        return this._innerRegistry.has(name);
    }
}

class MutableStateIdRegistry implements StateIdRegistry {
    _stateIds: Map<string, StateId>;

    constructor () {
        this._stateIds = new Map();
    }

    get (name: string): StateId {
        let stateId = this._stateIds.get(name);

        if (!stateId) {
            stateId = new StandardStateId(name);
        }

        this._stateIds.set(name, stateId);

        return stateId;
    }

    has (name: string): boolean {
        return this._stateIds.has(name);
    }
}

interface ExampleContext {
    result(void): void;
}

class StandardExampleContext implements ExampleContext {
    result () {
    }
}


const x: ExampleContext = new StandardExampleContext();
const mb: MachineBuilder<ExampleContext> = new StandardMachineBuilder(StandardExampleContext);
const m: Machine<ExampleContext> = mb.build();
m.run(x);
