/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    OptionType,
    ProgramSpec
} from './types';

import type { Process } from '../types';

class CommandSpecBuilder {
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

class GroupSpecBuilder {
    _commands: Map<string, CommandSpec>;
    _name: string;
    _subgroups: Map<string, GroupSpec>;

    constructor (name: string) {
        this._commands = new Map();
        this._name = name;
        this._subgroups = new Map();
    }

    build (): GroupSpec {
        const groupSpec: GroupSpec = {
            commands: Array.from(this._commands).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            name: this._name,
            subgroups: Array.from(this._subgroups).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
        };

        return groupSpec;
    }

    command (command: CommandSpec): GroupSpecBuilder {
        this._commands.set(command.name, command);
        return this;
    }

    subgroup (subgroup: GroupSpec): GroupSpecBuilder {
        this._subgroups.set(subgroup.name, subgroup);
        return this;
    }
}

class OptionSpecBuilder<T: OptionType> {
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

    command (command: CommandSpec): ProgramSpecBuilder {
        this._commands.set(command.name, command);
        return this;
    }

    group (group: GroupSpec): ProgramSpecBuilder {
        this._groups.set(group.name, group);
        return this;
    }
}

export default {
    command: {
        named: function (name: string) {
            return new CommandSpecBuilder(name);
        }
    },
    group: function (name: string) {
        return new GroupSpecBuilder(name);
    },
    option: {
        boolean (name: string): OptionSpecBuilder<boolean> {
            return new OptionSpecBuilder(name, true);
        },
        number (name: string): OptionSpecBuilder<number> {
            return new OptionSpecBuilder(name, 0);
        },
        string (name: string): OptionSpecBuilder<string> {
            return new OptionSpecBuilder(name, '');
        }
    },
    program: function () {
        return new ProgramSpecBuilder();
    }
}
