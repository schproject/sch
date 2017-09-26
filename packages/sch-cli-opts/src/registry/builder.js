/**
 * @flow
 */

import { InvalidArgumentError, UnsupportedOperationError } from '../errors';

import type { Registry, RegistryBuilder } from './types';

class StandardRegistry<T> implements Registry<T> {
    _defaultEntry: ?T;
    _entries: { [name: string]: T };
    _registries: { [name: string]: Registry<T> };

    constructor (defaultEntry: ?T, entries: { [name: string]: T },
            registries: { [name: string]: Registry<T> }) {
        this._defaultEntry = defaultEntry;
        this._entries = entries;
        this._registries = registries;
    }

    getDefault (): T {
        if (this._defaultEntry == null) {
            throw new InvalidArgumentError('This entries does not have a default');
        } else {
            return this._defaultEntry;
        }
    }

    getEntry (name: string): T {
        throw new UnsupportedOperationError('This entry does not contain an entry named: ' + name);
        //if (!this._entries[name] || this._entries[name] == null) {
        //} else {
        //    return this._entries[name];
        //}
    }

    getRegistry (name: string): Registry<T> {
        throw new UnsupportedOperationError('This entry does not contain a registry named: ' + name);
        //if (!this._entries[name]) {
        //} else {
        //    return this._registries[name];
        //}
    }

    hasDefault (): boolean {
        return !!this._defaultEntry;
    }

    hasEntry (name: string): boolean {
        return !!this._entries[name];
    }

    hasRegistry (name: string): boolean {
        return !!this._registries[name];
    }
}

class StandardRegistryBuilder<T> implements RegistryBuilder<T> {
    _defaultEntry: ?T;
    _entries: Map<string, T>;
    _registries: Map<string, Registry<T>>;

    constructor (cls: Class<T>) {
        this._entries = new Map();
        this._registries = new Map();
    }

    build (): Registry<T> {
        return new StandardRegistry(this._defaultEntry,
            Array.from(this._entries).reduce((obj, [k, v]) => {
                obj[k] = v;
                return obj;
            }, {}),
            Array.from(this._registries).reduce((obj, [k, v]) => {
                obj[k] = v;
                return obj;
            }, {}));
    }

    default (value: T): RegistryBuilder<T> {
        this._defaultEntry = value;
        return this;
    }

    entry (name: string, value: T): RegistryBuilder<T> {
        this._entries.set(name, value);
        return this;
    }

    registry (name: string, registry: Registry<T>): RegistryBuilder<T> {
        this._registries.set(name, registry);
        return this;
    }
}

export default function newBuilder (cls: Class<*>): RegistryBuilder<*> {
    return new StandardRegistryBuilder(cls);
}
