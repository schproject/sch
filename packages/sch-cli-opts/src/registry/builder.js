/**
 * @flow
 */

import type { Registry, RegistryBuilder } from './types';

class ArrayRegistry<T> implements Registry<T> {
    _registries: Array<Registry<T>>;

    constructor (registries: Array<Registry<T>>) {
        this._registries = registries;
    }

    find (...names: Array<string>): ?T {
        let idx;
        for (idx = 0; idx < this._registries.length; idx++) {
            const value = this._registries[idx].find(...names);
            if (value != null) {
                return value;
            }
        }
        return null;
    }
}

class DefaultEntryRegistry<T> implements Registry<T> {
    _entry: T;

    constructor (entry: T) {
        this._entry = entry;
    }

    find (...names: Array<string>): ?T {
        if (names.length == 0) {
            return this._entry;
        } else {
            return null;
        }
    }
}

class MapRegistry<T> implements Registry<T> {
    _registries: { [name: string]: Registry<T> };

    constructor (registries: { [name: string]: Registry<T> }) {
        this._registries = registries;
    }

    find (...names: Array<string>): ?T {
        const [ firstName, ...lastNames ] = names;

        if (firstName && this._registries[firstName]) {
            return this._registries[firstName].find(...lastNames);
        } else {
            return null;
        }
    }
}

class StandardRegistryBuilder<T> implements RegistryBuilder<T> {
    _default: ?DefaultEntryRegistry<T>;
    _registries: Map<string, Registry<T>>;

    constructor (cls: Class<T>) {
        this._registries = new Map();
    }

    build (): Registry<T> {
        const registries = [];

        if (this._default != null) {
            registries.push(this._default);
        }

        registries.push(new MapRegistry(this._registries));

        return new ArrayRegistry(registries);
    }

    default (value: T): RegistryBuilder<T> {
        this._default = new DefaultEntryRegistry(value);;
        return this;
    }

    entry (name: string, value: T): RegistryBuilder<T> {
        this._registries.set(name, new DefaultEntryRegistry(value));
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
