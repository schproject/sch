/**
 * @flow
 */

import type { StateId, StateIdRegistry } from './types';

export class ReferenceTrackingStateIdRegistry implements StateIdRegistry {
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
