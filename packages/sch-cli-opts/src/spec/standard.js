/**
 * @flow
 */

import { Registry } from '../registry';

import type { CommandSpec, OptionSpec, OptionType,
    NamedOptionSpec, ProgramSpec } from './types';

export class StandardCommandSpec implements CommandSpec {
    _args: Array<NamedOptionSpec<*>>;
    _flags: { [name: string]: OptionSpec<*> };

    constructor (args: Array<NamedOptionSpec<*>>,
            flags: { [name: string]: OptionSpec<*> }) {
        this._args = args;
        this._flags = flags;
    }

    args (): Array<NamedOptionSpec<*>> {
        return this._args;
    }

    flags (): { [name: string]: OptionSpec<*> } {
        return this._flags;
    }
}

export class StandardOptionSpec<T: OptionType> implements OptionSpec<T> {
    _defaultValue: T | (Process) => T;
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (defaultValue: T | Process => T,
            multiple: boolean, optional: boolean, sample: T) {
        this._defaultValue = defaultValue;
        this._multiple = multiple;
        this._optional = optional;
        this._sample = sample;
    }

    defaultValue (process: Process): T {
        if (typeof this._defaultValue == 'function') {
            return this._defaultValue(process);
        } else {
            return this._defaultValue;
        }
    }

    multiple (): boolean {
        return this._multiple;
    }

    optional (): boolean {
        return this._optional;
    }

    sample (): T {
        return this._sample;
    }
}

export class StandardNamedOptionSpec<T: OptionType> extends StandardOptionSpec<T> implements NamedOptionSpec<T> {
    _name: string;

    constructor (name: string, optionSpec: OptionSpec<T>) {
        super(optionSpec.defaultValue, optionSpec.multiple(),
            optionSpec.optional(), optionSpec.sample());

        this._name = name;
    }

    name () {
        return this._name;
    }
}
