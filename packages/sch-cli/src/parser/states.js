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

import { IllegalStateEntryError } from './errors';

import  { OptionParser } from './parser';

import type {
    LineSpec,
    OptionSpec,
    ParserState,
    StateTransition
} from './types';

export class DoneState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        throw new IllegalStateEntryError(DONE);
    }
}

export class InitialState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        console.log('Attempting to transition to', READ_ARG);
        transition(argIndex, READ_ARG);
    }
}

export class InvalidArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        console.error(args[argIndex], 'is an invalid arg');
        transition(argIndex, DONE);
    }
}

export class InvalidFlagState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        console.error(args[argIndex], 'is an invalid flag');
        transition(argIndex, DONE);
    }
}

export class ReadArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        const arg = args[argIndex];
        console.log('Reading arg', arg);
        if (arg.startsWith('-')) {
            transition(argIndex, PARSE_FLAG);
        } else {
            transition(argIndex, PARSE_ARG);
        }
    }
}

export class ParseArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        const flag = args[argIndex];
        console.log('Parsing arg', args[argIndex]);
        transition(argIndex + 1, READ_ARG);
    }
}

export class ParseFlagState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        const flag = args[argIndex];

        console.log('Parsing flag', flag);

        if(!lineSpec.flagSpecs[flag]) {
            transition(argIndex, INVALID_FLAG);
        } else {
            transition(argIndex + 1, PARSE_FLAG_VALUE);
        }
    }
}

export class ParseFlagValueState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            lineSpec: LineSpec, transition: StateTransition) {
        const rawValue = args[argIndex];
        const flagSpec: OptionSpec<*> = lineSpec.flagSpecs[args[argIndex - 1]];
        const optionParser: OptionParser<typeof flagSpec.sample> = new OptionParser(flagSpec);

        optionParser.parse(rawValue);

        transition(argIndex + 1, READ_ARG);
    }
}
