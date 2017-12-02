/**
 * @flow
 */

import type { Machine, MachineBuilder,
    State, StateFactory,
    StateId, StateIdRegistry } from './types';

class StandardMachineBuilder<T> implements MachineBuilder<T> {
    _contextClass: Class<T>;
    _states: Map<StateId, State<T>>;
    _stateIds: StateIdRegistry;
    _stateIdReferences: StateIdRegistry;

    constructor (contextClass: Class<T>) {
        this._contextClass = contextClass;
        this._states = new Map();
        this._stateIds = new StandardStateIdRegistry();
        this._stateIdReferences = new StandardStateIdRegistry();
    }

    build (): Machine<T> {
        return { 
            run() {}
        }
    }

    state (name: string, createState: StateFactory<T>): MachineBuilder<T> {
        if (this._stateIds.has(name)) {
            throw new Error('There is already a state with name: ' + name);
        }

        const stateId = this._stateIds.get(name);
        this._states.set(stateId, createState(this._stateIdReferences));

        return this;
    }
}

class StandardStateIdRegistry implements StateIdRegistry {
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

class StandardStateId implements StateId {
    _name: string;

    constructor (name: string) {
        this._name = name;
    }

    name (): string {
        return this._name;
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
