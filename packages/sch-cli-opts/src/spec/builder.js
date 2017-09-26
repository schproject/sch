/**
 * @flow
 */

import type { PrimitiveType, Process } from 'sch-common';

import { IllegalStateError } from '../errors';

import { Registry, RegistryBuilder, registryBuilder } from '../registry';

import type { CommandSpec, OptionSpec, OptionType,
    NamedOptionSpec, ProgramSpec } from './types';

import { StandardCommandSpec, StandardOptionSpec,
    StandardNamedOptionSpec, } from './standard';

class CommandSpecBuilder {
    _args: Array<NamedOptionSpec<*>>;
    _flags: Map<string, OptionSpec<*>>;

    constructor () {
        this._args= [];
        this._flags = new Map();
    }

    arg (name: string, optionSpec: OptionSpec<*>): CommandSpecBuilder {
        this._args.push(new StandardNamedOptionSpec(name, optionSpec));
        return this;
    }

    build (): CommandSpec {
        return new StandardCommandSpec(this._args.slice(),
            Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}));
    }

    flag (name: string, option: OptionSpec<*>): CommandSpecBuilder {
        this._flags.set(name, option);
        return this;
    }
}

class OptionSpecBuilder<T: PrimitiveType> {
    _defaultValue: T | Process => T;
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (sample: T) {
        this._sample = sample;
    }

    build (): OptionSpec<T> {
        return new StandardOptionSpec(this._defaultValue,
            this._multiple, this._optional, this._sample);
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

class ProgramSpecBuilder {
    _registryBuilder: RegistryBuilder<CommandSpec>;

    constructor () {
        this._registryBuilder = registryBuilder(StandardCommandSpec);
    }

    build (): ProgramSpec {
        return this._registryBuilder.build();
    }

    default (command: CommandSpec): ProgramSpecBuilder {
        this._registryBuilder.default(command);
        return this;
    }

    command (name: string, command: CommandSpec): ProgramSpecBuilder {
        this._registryBuilder.entry(name, command);
        return this;
    }

    group (name: string, group: Registry<CommandSpec>): ProgramSpecBuilder {
        this._registryBuilder.registry(name, group);
        return this;
    }
}


export default {
    command: function () {
        return new CommandSpecBuilder();
    },
    option: {
        boolean (): OptionSpecBuilder<boolean> {
            return new OptionSpecBuilder(true);
        },
        number (): OptionSpecBuilder<number> {
            return new OptionSpecBuilder(0);
        },
        string (): OptionSpecBuilder<string> {
            return new OptionSpecBuilder('');
        }
    },
    program: function () {
        registryBuilder(StandardCommandSpec);
    }
}
