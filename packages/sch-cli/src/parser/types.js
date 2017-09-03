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

import { Process } from '../types';

export interface LineSpec {
    +argSpecs: Array<OptionSpec<*>>;
    +flagSpecs: { [name: string]: OptionSpec<*> };
}

export interface OptionSpec<T: OptionType> {
    +defaultValue: T | Process => T;
    +multiple: boolean;
    +name: string;
    +optional: boolean;
    +sample: T;
}

export type OptionType = boolean | number | string;

export interface Parser {
    +parse: (args: Array<string>, lineSpec: LineSpec) => void;
}

export interface ParserContext {
    +getArgIndex: (void) => number;
    +getState: (void) => string;
    +isDone: (void) => boolean;
    +transition: (nextArgIndex: number, nextState: string) => void;
}

export interface ParserState {
    +enter: (argIndex: number, args: Array<string>,
        lineSpec: LineSpec,  transition: StateTransition) => void;
}

export type StateTransition = (nextArgIndex: number, nextState: string) => void;
