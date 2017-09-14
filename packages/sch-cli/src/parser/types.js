/**
 * @flow
 */

import type {
    CommandOption,
    CommandOptionValue
} from '../command';

import type {
    OptionType,
    ProgramSpec
} from '../spec';

import { Process } from '../types';

export interface Parser {
    +parse: (args: Array<string>, commandSpec: ProgramSpec) => void;
}

export interface ParserContext {
    +getArgIndex: (void) => number;
    +getError: (void) => ?ParserError;
    +getResult: (void) => ParserResult;
    +getState: (void) => ParserState;
    +hasError: (void) => boolean;
    +isDone: (void) => boolean;
    +terminate: ParserStateTermination;
    +transition: ParserStateTransition;
}

export interface ParserError {
    +detail?: string;
    +type: ParserErrorType;
}

export type ParserErrorType =
    | 'invalid-arg'
    | 'invalid-flag'
    | 'invalid-flag-value'
    | 'invalid-name'
    | 'multiple-values-not-allowed'
    | 'no-value-found-for-flag'
    | 'required-flag-not-found';

export interface ParserResult {
    +args: { [name: string]: CommandOptionValue };
    +flags: { [name: string]: CommandOptionValue };
    +names: Array<string>;
}

export type ParserState = (args: Array<string>,
    parserContext: ParserContext, programSpec: ProgramSpec) => void;

export interface ParserStateResult {
    +name: string;
    +type: ParserStateResultType;
    +value?: CommandOptionValue;
}

type ParserStateResultType = 'arg' | 'flag' | 'name';

export type ParserStateTermination = (error?: ParserError) => void;
export type ParserStateTransition = (nextArgIndex: number, nextState: ParserState, result?: ParserStateResult) => void;
