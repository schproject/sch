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
    StateNotFoundError
} from './errors';

import States from './states';

import type {
    Parser,
    ParserContext,
    ParserError,
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

    constructor (context: ParserContext) {
        this.context = context;
    }

    parse (args: Array<string>, programSpec: ProgramSpec): void {
        const transition = this.context.transition.bind(this.context);

        while(!this.context.isDone()) {
            const argIndex = this.context.getArgIndex();
            const state: ParserState = this.context.getState();

            if (argIndex >= args.length) {
                this.context.terminate();
            } else {
                state(args, this.context, programSpec);
            }
        }
    }
}

export class StandardParserContext implements ParserContext {
    argIndex: number;
    error: ?ParserError;;
    result: ParserResultBuilder;
    state: ParserState;

    constructor () {
        this.argIndex = 0;
        this.result = ParserResultBuilder.new();
        this.state = States.Initial;
    }

    getArgIndex (): number {
        return this.argIndex;
    }

    getError (): ?ParserError {
        return this.error;
    }

    getResult (): ParserResult {
        return this.result;
    }

    getState (): ParserState {
        return this.state;
    }

    hasError (): boolean {
        return this.error != null;
    }

    isDone (): boolean {
        return this.state == States.Done;
    }

    terminate (error?: ParserError) {
        if (this.error) {
            this.error = error;
        }
        this.transition(this.getArgIndex(), States.Done);
    }

    transition (nextArgIndex: number, nextState: ParserState, result?: ParserStateResult) {
        this.argIndex = nextArgIndex;

        if (result != null) {
            switch (result.type) {
                case 'arg':
                    if (result.value) {
                        this.result.arg(result.name, result.value);
                    }
                    break;
                case 'flag':
                    if (result.value) {
                        this.result.flag(result.name, result.value);
                    }
                    break;
                case 'name':
                    this.result.name(result.name);
                    break;
            }
        }

        this.state = nextState;
    }
}

export function createParser () {
    return new StandardParser(new StandardParserContext());
}
