/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    OptionType,
    NamedOptionSpec,
    ProgramSpec
} from './types';

import type { Process } from '../types';

class CommandSpecBuilder {
    _args: Array<NamedOptionSpec<*>>;
    _flags: Map<string, OptionSpec<*>>;

    constructor () {
        this._args= [];
        this._flags = new Map();
    }

    arg (name: string, { defaultValue, multiple, optional, sample }: OptionSpec<*>): CommandSpecBuilder {
        this._args.push({
            defaultValue,
            multiple,
            name,
            optional,
            sample
        });
        return this;
    }

    build (): CommandSpec {
        const commandSpec: CommandSpec = {
            args: this._args.slice(),
            flags: Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {})
        };

        return commandSpec;
    }

    flag (name: string, option: OptionSpec<*>): CommandSpecBuilder {
        this._flags.set(name, option);
        return this;
    }
}

class GroupSpecBuilder {
    _commands: Map<string, CommandSpec>;
    _groups: Map<string, GroupSpec>;

    constructor () {
        this._commands = new Map();
        this._groups = new Map();
    }

    build (): GroupSpec {
        const groupSpec: GroupSpec = {
            commands: Array.from(this._commands).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            groups: Array.from(this._groups).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {})
        };

        return groupSpec;
    }

    command (name: string, command: CommandSpec): GroupSpecBuilder {
        this._commands.set(name, command);
        return this;
    }

    group (name: string, group: GroupSpec): GroupSpecBuilder {
        this._groups.set(name, group);
        return this;
    }
}

class OptionSpecBuilder<T: OptionType> {
    _defaultValue: T | Process => T;
    _multiple: boolean;
    _optional: boolean;
    _sample: T;

    constructor (sample: T) {
        this._sample = sample;
    }

    build (): OptionSpec<T> {
        const spec: OptionSpec<T> = {
            defaultValue: this._defaultValue,
            multiple: this._multiple,
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

class ProgramSpecBuilder {
    _commands: Map<string, CommandSpec>;
    _groups: Map<string, GroupSpec>;

    constructor () {
        this._commands = new Map();
        this._groups = new Map();
    }

    build (): ProgramSpec {
        const programSpec: ProgramSpec = {
            commands: Array.from(this._commands).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            groups: Array.from(this._groups).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
        };

        return programSpec;
    }

    command (name: string, command: CommandSpec): ProgramSpecBuilder {
        this._commands.set(name, command);
        return this;
    }

    group (name: string, group: GroupSpec): ProgramSpecBuilder {
        this._groups.set(name, group);
        return this;
    }
}

export default {
    command: function () {
        return new CommandSpecBuilder();
    },
    group: function () {
        return new GroupSpecBuilder();
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
        return new ProgramSpecBuilder();
    }
}
