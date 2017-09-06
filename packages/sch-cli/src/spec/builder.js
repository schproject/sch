/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import type {
    CommandSpec,
    GroupSpec,
    NamedGroupSpec,
    OptionSpec,
    OptionType
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
    _subgroups: Map<string, NamedGroupSpec>;

    constructor () {
        this._commands = new Map();
        this._subgroups = new Map();
    }

    build (): GroupSpec {
        const groupSpec: GroupSpec = {
            commands: Array.from(this._commands).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
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

    subgroup (subgroup: NamedGroupSpec): GroupSpecBuilder {
        this._subgroups.set(subgroup.name, subgroup);
        return this;
    }
}

class NamedGroupSpecBuilder {
    _builder: GroupSpecBuilder;
    _name: string;

    constructor (name: string) {
        this._builder = new GroupSpecBuilder();
        this._name = name;
    }

    build (): NamedGroupSpec {
        const namedGroupSpec: NamedGroupSpec = Object.assign({}, this._builder.build(), {
            name: this._name,
        });

        return namedGroupSpec;
    }

    command (command: CommandSpec): NamedGroupSpecBuilder {
        this._builder.command(command);
        return this;
    }

    subgroup (subgroup: NamedGroupSpec): NamedGroupSpecBuilder {
        this._builder.subgroup(subgroup);
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

export default {
    command: {
        named: function (name: string) {
            return new CommandSpecBuilder(name);
        }
    },
    group: {
        new: function () {
            return new GroupSpecBuilder();
        },
        named: function (name: string) {
            return new NamedGroupSpecBuilder(name);
        }
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
    }
}
