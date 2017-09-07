/**
 * @flow
 */

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
    +transition: StateTransition;
}

export interface ParserResult {
    +names: Array<string>;
    +options: { [key: string]: OptionType | Array<OptionType> };
}

export interface ParserState {
    +enter: (argIndex: number, args: Array<string>,
        programSpec: ProgramSpec, transition: StateTransition) => void;
}

export interface ParserStateResult<T: OptionType> {
    +name: string;
    +value?: T | Array<T>;
}

export type StateTransition = (nextArgIndex: number, nextState: string, result?: ParserStateResult<*>) => void;
