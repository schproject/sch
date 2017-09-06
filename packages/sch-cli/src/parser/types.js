/**
 * @flow
 */

import { CommandSpec } from '../spec';

import { Process } from '../types';

export interface Parser {
    +parse: (args: Array<string>, commandSpec: CommandSpec) => void;
}

export interface ParserContext {
    +getArgIndex: (void) => number;
    +getState: (void) => string;
    +isDone: (void) => boolean;
    +transition: (nextArgIndex: number, nextState: string) => void;
}

export interface ParserState {
    +enter: (argIndex: number, args: Array<string>,
        commandSpec: CommandSpec,  transition: StateTransition) => void;
}

export type StateTransition = (nextArgIndex: number, nextState: string) => void;
