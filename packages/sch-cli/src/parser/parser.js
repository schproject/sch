/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import { StateNotFoundError } from './errors';

import type {
    CommandSpec,
    GroupSpec,
    ProgramSpec,
    OptionSpec
} from '../spec';

import States from './states';

import type { PrimitiveType } from '../types';

import type {
    OptionSpecAndValue,
    Parser,
    ParserContext,
    ParserError,
    ParserResult,
    ParserResultBuilder,
    ParserState,
    ParserStateTransition
} from './types';

const INITIAL_PARSER_RESULT: ParserResult = {
    arg: (name: string) => {
        throw new IllegalStateError('There is no arg present with name "' + name + '" present in result');
    },
    args: () => [],
    command: () => {
        throw new IllegalStateError('There is no command spec present in result');
    },
    error: () => null,
    flag: (name: string) => {
        throw new IllegalStateError('There is no flag present with name "' + name + '" present in result');
    },
    flags: () => { return {}; },
    groups: () => []
};

export class StandardParserResultBuilder implements ParserResultBuilder {
    _args: Array<[string, OptionSpecAndValue<*>]>;
    _command: ?CommandSpec;
    _error: ?ParserError;
    _flags: Map<string, OptionSpecAndValue<*>>;
    _groups: Map<string, GroupSpec>;

    constructor () {
        this._args = [];
        this._flags = new Map();
        this._groups = new Map();
    }

    arg (name: string, arg: OptionSpecAndValue<*>): ParserResultBuilder {
        if (this._args.find(tuple => tuple[0] == name)) {
            throw new IllegalStateError('An argument with this name has already been collected: ' + name);
        }

        this._args.push([name, arg]);

        return this;
    }

    command (commandSpec: CommandSpec): ParserResultBuilder {
        if (this._command != null) {
            throw new IllegalStateError('A command spec has already been collected');
        }

        this._command = commandSpec;

        return this;
    }

    error (error: ParserError): ParserResultBuilder {
        if (this._error) {
            throw new IllegalStateError('A parser error has already been collected');
        }

        this._error = error;

        return this;
    }

    flag (name: string, flag: OptionSpecAndValue<*>): ParserResultBuilder {
        if (this._flags.has(name)) {
            throw new IllegalStateError('A flag with this name has already been collected: ' + name);
        }

        this._flags.set(name, flag);

        return this;
    }

    group (name: string, group: GroupSpec): ParserResultBuilder {
        if (this._groups.has(name)) {
            throw new IllegalStateError('A group with this name has already been collected: ' + name);
        }

        this._groups.set(name, group);

        return this;
    }

    result (): ParserResult {
        return new StandardParserResult(
            this._args.slice(),
            this._command,
            this._error,
            Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}));
    }
}

export class StandardParser implements Parser {
    context: ParserContext;
    resultBuilder: ParserResultBuilder;

    constructor (context: ParserContext,
            resultBuilder: ParserResultBuilder) {
        this.context = context;
        this.resultBuilder = resultBuilder;
    }

    parse (): void {
        this.parse_(0, this.context.args, this.context.program, States.Initial);
    }

    parse_ (argIndex: number, args: Array<string>, program: ProgramSpec, state: ParserState) {
        if (argIndex >= args.length || state == States.Done) return;

        const parse = this.parse;
        const transition = function (nextArgIndex: number, nextState: ParserState) {
            //parse(nextArgIndex, args, program, nextState);
        }

        const result = this.resultBuilder.build();
        state.call(null, argIndex, args, program, this.resultBuilder, result, transition.bind(this));
    }
}

export class StandardParserResult {
    _args: Array<[string, OptionSpecAndValue<*>]>;
    _command: ?CommandSpec;
    _error: ?ParserError;
    _groups: Array<[string, GroupSpec]>;
    _flags: { [name: string]: OptionSpecAndValue<*> };

    constructor (args: Array<[string, OptionSpecAndValue<*>]>,
            command: ?CommandSpec, error: ?ParserError,
            flags: { [name: string]: OptionSpecAndValue<*> }) {
        this._args = args;
        this._command = command;
        this._error = error;
        this._flags = flags;
    }

    arg (name: string): OptionSpecAndValue<*> {
        const tuple = this._args.find(tuple => tuple[0] == name);

        if (!tuple) {
            throw new IllegalStateError('No arg is present in this result with the requested name: ' + name);
        }

        return tuple[1];
    }

    args (): Array<[string, OptionSpecAndValue<*>]> {
        return this._args.slice();
    }

    command (): CommandSpec {
        if (this._command == null) {
            throw new IllegalStateError('No command is present in this result');
        } else {
            return this._command;
        }
    }

    error (): ?ParserError {
        return this.error;
    }

    flag (name: string): OptionSpecAndValue<*> {
        const flag: ?OptionSpecAndValue<*> = this._flags[name];

        if (!flag) {
            throw new IllegalStateError('No flag is present in this result with the requested name: ' + name);
        }

        return flag;
    }

    flags (): { [name: string]: OptionSpecAndValue<*> } {
        return this._flags;
    }

    groups (): Array<[string, GroupSpec]> {
        return this._groups;
    }
}

export function createParser (args: Array<string>, program: ProgramSpec) {
    return new StandardParser({ args, program },
        new StandardParserResultBuilder());
}
