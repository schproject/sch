/**
 * @flow
 */

import {
    DONE,
    INITIAL,
    INVALID_ARG,
    INVALID_FLAG,
    PARSE_ARG,
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
    ParseFlagState,
    ParseFlagValueState,
    ReadArgState
} from './states';

import type {
    LineSpec,
    OptionSpec,
    OptionType,
    Parser,
    ParserContext,
    ParserState,
    StateTransition
} from './types';

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

export class StandardParser implements Parser {
    context: ParserContext;
    states: { [label: string]: ParserState };

    constructor (context: ParserContext,
        states: { [label: string]: ParserState }) {
        this.context = context;
        this.states = states;
    }

    parse (args: Array<string>, lineSpec: LineSpec): void {
        console.log('Parsing args', args);
        const transition = this.context.transition.bind(this.context);

        while(!this.context.isDone()) {
            const argIndex = this.context.getArgIndex();
            const label: string = this.context.getState();
            const state: ?ParserState = this.states[label];

            if(!state) {
                throw new StateNotFoundError(label);
            } else if (argIndex >= args.length) {
                transition(argIndex, DONE);
            } else {
                console.log('Entering state', label);
                state.enter(argIndex, args, lineSpec, transition);
            }
        }
    }
}

export class StandardParserContext implements ParserContext {
    argIndex: number;
    state: string;

    constructor () {
        this.argIndex = 0;
        this.state = INITIAL;
    }

    getArgIndex (): number {
        return this.argIndex;
    }

    getState (): string {
        return this.state;
    }

    isDone (): boolean {
        return this.state == DONE;
    }

    transition (nextArgIndex: number, nextState: string) {
        console.log('Recording next state', nextState);
        this.argIndex = nextArgIndex;
        this.state = nextState;
    }
}

export class StateContainerBuilder {
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
            .add(PARSE_FLAG, new ParseFlagState())
            .add(PARSE_FLAG_VALUE, new ParseFlagValueState())
            .add(READ_ARG, new ParseFlagState())
            .build());
}
