/**
 * @flow
 */

import type { CommandOption } from '../command';

import type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    NamedGroupSpec,
    NamedOptionSpec,
    ProgramSpec
} from '../spec';

import type { PrimitiveArray, PrimitiveType, Process } from '../types';

export interface NamedOptionSpecAndValue<T: PrimitiveType> {
    +name: string;
    +spec:  NamedOptionSpec<T>;
    +value: T | Array<T>;
}

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
    +arg: (name: string) => NamedOptionSpecAndValue<*>;
    +args: (void) => Array<NamedOptionSpecAndValue<*>>;
    +command: () => CommandSpec;
    +error: (void) => null | ParserError;
    +flag: (name: string) => NamedOptionSpecAndValue<*>;
    +flags: (void) => { [name: string]: NamedOptionSpecAndValue<*> };
    +groups: (void) => Array<NamedGroupSpec>;
}

export interface ParserResultCollector {
    +arg: (arg: NamedOptionSpecAndValue<*>) => ParserResultCollector; 
    +command: (commandSpec: CommandSpec) => ParserResultCollector;
    +error: (error: ParserError) => ParserResultCollector;
    +flag: (flag: NamedOptionSpecAndValue<*>) => ParserResultCollector;
    +group: (group: NamedGroupSpec) => ParserResultCollector;
}

export type ParserState = (args: Array<string>, parserContext: ParserContext,
    programSpec: ProgramSpec, resultCollector: ParserResultCollector) => void;

export type ParserStateTermination = (error?: ParserError) => void;
export type ParserStateTransition = (nextArgIndex: number, nextState: ParserState) => void;
