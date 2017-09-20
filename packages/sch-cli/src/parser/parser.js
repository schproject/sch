/**
 * @flow
 */

import loglevel from 'loglevel';

import { IllegalStateError } from '../errors';

import type { CommandSpec, GroupSpec, ProgramSpec, OptionSpec } from '../spec';

import type { PrimitiveType, PrimitiveArray } from '../types';

import { StateNotFoundError } from './errors';
import States from './states';

import type { OptionSpecAndValue, Parser, ParserContext,
    ParserError, ParserResult, ParserResultBuilder, ParserState,
    ParserStateTransition } from './types'; 

export class StandardParserResultBuilder implements ParserResultBuilder {
    _args: Array<[string, OptionSpecAndValue<*>]>;
    _command: ?CommandSpec;
    _error: ?ParserError;
    _flags: Map<string, OptionSpecAndValue<*>>;
    _groups: Array<[string, GroupSpec]>;

    constructor () {
        this._args = [];
        this._flags = new Map();
        this._groups = [];
    }

    build (): ParserResult {
        return new StandardParserResult(
            this._args.slice(),
            this._command,
            this._error,
            Array.from(this._flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            this._groups.slice());
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

    flag (name: string, spec: OptionSpec<*>): ParserResultBuilder {
        const flag = this._flags.get(name);

        if (flag) {
            throw new IllegalStateError('A flag with this name has been collected: ' + name);
        }

        this._flags.set(name, { spec });

        return this;
    }

    flagValue (name: string, value: PrimitiveType): ParserResultBuilder {
        const flag = this._flags.get(name);

        if (!flag) {
            throw new IllegalStateError('No flag with this name has been collected: ' + name);
        }

        let newValue;
        if (flag.multiple) {
            newValue = [];

            if(flag.value) {
                newValue.concat(flag.value);
            }

            newValue.push(value);
        } else {
            newValue = value;
        }

        this._flags.set(name, {
            spec: flag.spec,
            value: newValue
        });

        return this;
    }

    group (name: string, group: GroupSpec): ParserResultBuilder {
        if (this._groups.find(tuple => tuple[0] == name)) {
            throw new IllegalStateError('A group with this name has already been collected: ' + name);
        }

        this._groups.push([name, group]);

        return this;
    }
}

export class StandardParser implements Parser {
    _context: ParserContext;
    _log: any;
    _resultBuilder: ParserResultBuilder;

    constructor (context: ParserContext,
            resultBuilder: ParserResultBuilder) {
        this._context = context;
        this._log = loglevel.getLogger(`${__filename}:${this.constructor.name}`);
        this._resultBuilder = resultBuilder;
    }

    parse (): ParserResult {
        this._log.debug('beginning parse');
        this._parse(0, this._context.args, this._context.program, States.Initial);
        this._log.debug('finished parse');
        return this._resultBuilder.build();
    }

    _parse (argIndex: number, args: Array<string>, program: ProgramSpec, state: ParserState) {
        if (argIndex >= args.length || state == States.Done) return;

        const transition = function (nextArgIndex: number, nextState: ParserState) {
            this._log.debug(`transitioning index:${argIndex}=>${nextArgIndex}; state:${state.name}=>${nextState.name}`);
            this._parse(nextArgIndex, args, program, nextState);
        }

        state.call(null, argIndex, args, program, this._resultBuilder,
            this._resultBuilder.build(), transition.bind(this));
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
            flags: { [name: string]: OptionSpecAndValue<*> },
            groups: Array<[string, GroupSpec]>) {
        this._args = args;
        this._command = command;
        this._error = error;
        this._flags = flags;
        this._groups = groups;
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
