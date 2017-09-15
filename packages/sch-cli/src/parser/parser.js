/**
 * @flow
 */

import { IllegalStateError } from '../errors';

import { StateNotFoundError } from './errors';

import type {
    CommandSpec,
    GroupSpec,
    ProgramSpec,
    NamedGroupSpec,
    OptionSpec
} from '../spec';

import States from './states';

import type { PrimitiveType } from '../types';

import type {
    Parser,
    ParserContext,
    ParserError,
    ParserResult,
    ParserResultCollector,
    ParserState,
    ParserStateTransition,
    NamedOptionSpecAndValue,
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

export class StandardParser implements Parser {
    context: ParserContext;
    resultCollector: ParserResultCollector;

    constructor (context: ParserContext,
            resultCollector: ParserResultCollector) {
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
                state(args, this.context, programSpec, this.resultCollector);
            }
        }
    }
}

export class StandardParserContext implements ParserContext {
    argIndex: number;
    error: ?ParserError;
    state: ParserState;

    constructor () {
        this.argIndex = 0;
        this.state = States.Initial;
    }

    getArgIndex (): number {
        return this.argIndex;
    }

    getError (): ?ParserError {
        return this.error;
    }

    getResult (): ParserResult {
        return INITIAL_PARSER_RESULT;
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

    transition (nextArgIndex: number, nextState: ParserState) {
        this.argIndex = nextArgIndex;
        this.state = nextState;
    }
}

export class StandardParserResultCollector implements ParserResultCollector {
    args: Map<string, NamedOptionSpecAndValue<*>>;

    constructor () {
        this.args = new Map();
    }

    arg (arg: NamedOptionSpecAndValue<*>): ParserResultCollector {
        this.args.set(arg.name, arg);
        return this;
    }

    command (commandSpec: CommandSpec): ParserResultCollector {
        return this;
    }

    error (error: ParserError): ParserResultCollector {
        return this;
    }

    flag (flag: NamedOptionSpecAndValue<*>): ParserResultCollector {
        return this;
    }

    group (group: NamedGroupSpec): ParserResultCollector {
        return this;
    }
}

export function createParser () {
    return new StandardParser(new StandardParserContext(),
        new StandardParserResultCollector());
}
