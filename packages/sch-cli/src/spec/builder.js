/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import type {
    CommandSpec,
    OptionSpec,
    OptionType
} from '../spec';

import type { Process } from '../types';

export class CommandSpecBuilder {
    static new (name: string) {
        return new CommandSpecBuilder(name);
    }

    _args: Array<OptionSpec<*>>;
    _flags: Map<string, OptionSpec<*>>;
    _name: string;

    constructor (name: string) {
        this._args= [];
        this._flags = new Map();
        this._name = name;
    }

    arg (arg: OptionSpec<*>): CommandSpecBuilder {
        this._args.push(arg);
        return this;
    }

    build (): CommandSpec {
        const commandSpec: CommandSpec = {
            args: this._args.slice(),
            flags: Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            name: this._name
        };

        return commandSpec;
    }

    flag (option: OptionSpec<*>): CommandSpecBuilder {
        this._flags.set(option.name, option);
        return this;
    }

    name (name: string): CommandSpecBuilder {
        this._name = name;
        return this;
    }
}

export class OptionSpecBuilder<T: OptionType> {
    static boolean (name: string): OptionSpecBuilder<boolean> {
        return new OptionSpecBuilder(name, true);
    }

    static number (name: string): OptionSpecBuilder<number> {
        return new OptionSpecBuilder(name, 0);
    }

    static string (name: string): OptionSpecBuilder<string> {
        return new OptionSpecBuilder(name, '');
    }

    _defaultValue: T | Process => T;
    _name: string;
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (name: string, sample: T) {
        this._name = name;
        this._sample = sample;
    }

    build (): OptionSpec<T> {
        const spec: OptionSpec<T> = {
            defaultValue: this._defaultValue,
            multiple: this._multiple,
            name: this._name,
            optional: this._optional,
            sample: this._sample,
        }

        return spec;
    }

    defaultValue (defaultValue: T | Process => T): OptionSpecBuilder<T> {
        this._defaultValue = defaultValue;
        return this;
    }

    multiple (multiple: boolean = true): OptionSpecBuilder<T> {
        this._multiple = multiple;
        return this;
    }

    optional (optional: boolean = true): OptionSpecBuilder<T> {
        this._optional = optional;
        return this;
    }
}

export const option = {
}
