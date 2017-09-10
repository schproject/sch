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
    +getResult: (void) => ParserResult;
    +getState: (void) => string;
    +isDone: (void) => boolean;
    +transition: ParserStateTransition;
}

export interface ParserResult {
    +args: { [name: string]: CommandOptionValue };
    +flags: { [name: string]: CommandOptionValue };
    +names: Array<string>;
}

export interface ParserState {
    +enter: (args: Array<string>, parserContext: ParserContext,
        programSpec: ProgramSpec) => void;
}

export interface ParserStateResult {
    +name: string;
    +type: ParserStateResultType;
    +value?: CommandOptionValue;
}

type ParserStateResultType = 'arg' | 'flag' | 'name';

export type ParserStateTransition = (nextArgIndex: number, nextState: string, result?: ParserStateResult) => void;
