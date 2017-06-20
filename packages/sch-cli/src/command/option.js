/**
 * @flow
 */

import type { OptionSpec } from './types';
import type { Process } from '../types';

class State<T: Boolean | Number | String> {
    defaultValue: T;
    multiple: boolean;
    optional: boolean;
    name: string;
    type: Class<T>;

    constructor (type: Class<T>) {
        this.type = type;
    }
}

class Builder<T: Boolean | Number | String> {
    state: State<T>;

    constructor (type: Class<T>) {
        this.state = new State(type);
    }

    build (): OptionSpec<T> {
        const spec: OptionSpec<T> = {
            defaultValue: this.state.defaultValue,
            name: this.state.name,
            multiple: this.state.multiple,
            optional: this.state.optional,
            type: this.state.type,
        }

        return spec;
    }

    defaultValue (defaultValue: T): Builder<T> {
        this.state.defaultValue = defaultValue;
        return this;
    }

    multiple (multiple: boolean): Builder<T> {
        this.state.multiple = multiple;
        return this;
    }

    name (name: string): Builder<T> {
        this.state.name = name;
        return this;
    }

    optional (optional: boolean): Builder<T> {
        this.state.optional = optional;
        return this;
    }
}

export function builder<T: Boolean | Number | String> (type: Class<T>): Builder<T> {
    return new Builder(type);
}
