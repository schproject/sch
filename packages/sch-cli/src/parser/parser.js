/**
 * @flow
 */

import type {
    CommandOptionValue
} from '../command';

import type {
    ProgramSpec,
    OptionSpec,
    OptionType
} from '../spec';

import {
    DONE,
    INITIAL,
    INVALID_ARG,
    INVALID_FLAG,
    PARSE_ARG,
    PARSE_COMMAND_OR_GROUP_NAME,
    PARSE_COMMAND_NAME,
    PARSE_GROUP_NAME,
    PARSE_FLAG,
    PARSE_FLAG_VALUE,
    READ_ARG
} from './labels';

import {
    StateNotFoundError
} from './errors';

import {
    DoneState,
    InitialState,
    InvalidArgState,
    InvalidFlagState,
    ParseArgState,
    ParseCommandNameState,
    ParseCommandOrGroupNameState,
    ParseGroupNameState,
    ParseFlagOrArgState,
    ParseFlagState,
    ParseFlagValueState
} from './states';

import type {
    Parser,
    ParserContext,
    ParserResult,
    ParserState,
    ParserStateResult,
    ParserStateTransition
} from './types';

const INITIAL_PARSER_RESULT: ParserResult = {
    args: {},
    flags: {},
    names: []
};

export class OptionParser<T: OptionType> {
    option: OptionSpec<T>;
    refiner: OptionRefiner<T>;
    value: T | Array<T>;

    constructor (option: OptionSpec<T>) {
        this.option = option;
        this.refiner = new OptionRefiner(this, option.sample);

        if (option.multiple) {
            this.value = (this.refiner.switch({
                boolean: (_) => ([]: Array<boolean>),
                number: (_) => ([]: Array<number>),
                string: (_) => ([]: Array<string>)
            }): Array<T>);
        }
    }

    parse (value: string): OptionParser<T> {
        const typedValue = this.refiner.cast(value);

        if (this.value instanceof Array) {
            this.value.push(typedValue);
        } else {
            this.value = typedValue;
        }

        return this;
    }

    result () {
        return this.value instanceof Array
            ? this.value.slice()
            : this.value;
    }
}

class OptionRefiner<T: OptionType> {
    context: any;
    type: string;

    constructor (context: any, sample: T) {
        this.context = context;
        this.type = typeof sample;
    }

    cast (value: string): T {
        return this.switch({
            boolean: value => value,
            number: value => value,
            string: value => value
        }, value);
    }

    switch (callbacks: {
                'boolean': boolean => *,
                'number': number => *,
                'string': string => *
            }, value?: string): * {
        switch (this.type) {
            case 'boolean':
                return callbacks.boolean
                    .bind(this.context)((new Boolean(value)).valueOf());
            case 'number':
                return callbacks.number
                    .bind(this.context)((new Number(value)).valueOf());
            case 'string':
                return callbacks.string
                    .bind(this.context)((new String(value)).valueOf());
        }
    }
}

class ParserResultBuilder implements ParserResult {
    static new (initialParserResult: ParserResult = INITIAL_PARSER_RESULT) {
        return new ParserResultBuilder(initialParserResult);
    }

    args: Map<string, CommandOptionValue>;
    flags: Map<string, CommandOptionValue>;
    names: Array<string>;

    constructor ({ args, flags, names }: ParserResult) {
        this.args = Object.keys(args).reduce((map, key) => {
            map.set(key, args[key]);
            return map;
        }, new Map());

        this.flags = Object.keys(flags).reduce((map, key) => {
            map.set(key, flags[key]);
            return map;
        }, new Map());

        this.names = names.slice();
    }

    arg (name: string, value: CommandOptionValue): ParserResultBuilder {
        this.args.set(name, value);
        return this;
    }

    build (): ParserResult {
        return {
            args: Array.from(this.args).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            flags: Array.from(this.flags).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {}),
            names: this.names.slice()
        };
    }

    flag (name: string, value: CommandOptionValue): ParserResultBuilder {
        this.flags.set(name, value);
        return this;
    }

    name (name: string): ParserResultBuilder {
        this.names.push(name);
        return this;
    }
}

export class StandardParser implements Parser {
    context: ParserContext;
    states: { [label: string]: ParserState };

    constructor (context: ParserContext,
        states: { [label: string]: ParserState }) {
        this.context = context;
        this.states = states;
    }

    parse (args: Array<string>, programSpec: ProgramSpec): void {
        console.log('Parsing args', args);
        const transition = this.context.transition.bind(this.context);

        while(!this.context.isDone()) {
            const argIndex = this.context.getArgIndex();
            const label: string = this.context.getState();
            const state: ?ParserState = this.states[label];

            if(!state) {
                throw new StateNotFoundError(label);
            } else if (argIndex >= args.length) {
                console.log('Finished parsing args');
                this.context.transition(argIndex, DONE);
            } else {
                console.log('Entering state', label);
                state.enter(args, this.context, programSpec);
            }
        }
    }
}

export class StandardParserContext implements ParserContext {
    argIndex: number;
    result: ParserResultBuilder;
    state: string;

    constructor () {
        this.argIndex = 0;
        this.result = ParserResultBuilder.new();
        this.state = INITIAL;
    }

    getArgIndex (): number {
        return this.argIndex;
    }

    getResult (): ParserResult {
        return this.result;
    }

    getState (): string {
        return this.state;
    }

    isDone (): boolean {
        return this.state == DONE;
    }

    transition (nextArgIndex: number, nextState: string, result?: ParserStateResult) {
        console.log('Recording next state', nextState);

        this.argIndex = nextArgIndex;

        if (result != null) {
            const builder = ParserResultBuilder.new(this.result);

            switch (result.type) {
                case 'arg':
                    if (result.value) {
                        this.result = builder.arg(result.name, result.value);
                    }
                    break;
                case 'flag':
                    if (result.value) {
                        this.result = builder.flag(result.name, result.value);
                    }
                    break;
                case 'name':
                    this.result = builder.name(result.name);
                    break;
            }
        }

        this.state = nextState;
    }
}

class StateContainerBuilder {
    states: { [label: string]: ParserState };

    constructor () {
        this.states = {};
    }

    static new() {
        return new StateContainerBuilder();
    }

    add(label: string, state: ParserState): StateContainerBuilder {
        this.states[label] = state;
        return this;
    }

    build (): { [label: string]: ParserState } {
        return this.states;
    }
}

export function createParser () {
    return new StandardParser(new StandardParserContext(),
        StateContainerBuilder.new()
            .add(DONE, new DoneState())
            .add(INITIAL, new InitialState())
            .add(INVALID_ARG, new InvalidArgState())
            .add(INVALID_FLAG, new InvalidFlagState())
            .add(PARSE_ARG, new ParseArgState())
            .add(PARSE_COMMAND_NAME, new ParseCommandNameState())
            .add(PARSE_COMMAND_OR_GROUP_NAME, new ParseCommandOrGroupNameState())
            .add(PARSE_GROUP_NAME, new ParseGroupNameState())
            .add(PARSE_FLAG, new ParseFlagState())
            .add(PARSE_FLAG_VALUE, new ParseFlagValueState())
            .add(READ_ARG, new ParseFlagState())
            .build());
}
