/**
 * @flow
 */

import type { Builder, PrimitiveArray, PrimitiveType, Process } from 'sch-common';

import type { CommandSpec, OptionSpec, ProgramSpec } from '../spec';

export interface OptionSpecAndValue<T: PrimitiveType> {
    +spec:  OptionSpec<T>;
    +value?: T | Array<T>;
}

export interface Parser {
    +parse: (void) => ParserResult;
}

export interface ParserContext {
    +args: Array<string>;
    +program: ProgramSpec;
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

export interface ParserReporter {
    +arg: (name: string, arg: OptionSpecAndValue<*>) => ParserReporter; 
    +command: (commandSpec: CommandSpec) => ParserReporter;
    +error: (error: ParserError) => ParserReporter;
    +flag: (name: string, flag: OptionSpec<*>) => ParserReporter;
    +flagValue: (name: string, value: PrimitiveType) => ParserReporter;
    +group: (name: string) => ParserReporter;
}

export interface ParserResult {
    +arg: (name: string) => OptionSpecAndValue<*>;
    +args: (void) => Array<[string, OptionSpecAndValue<*>]>;
    +command: () => CommandSpec;
    +errors: (void) => Array<ParserError>;
    +flag: (name: string) => OptionSpecAndValue<*>;
    +flags: (void) => { [name: string]: OptionSpecAndValue<*> };
    +groups: (void) => Array<string>;
}

export interface ParserResultFactory {
    +result: (void) => ParserResult;
}

export type ParserResultBuilder = ParserReporter & Builder<ParserResult>;

export type ParserState = (argIndex: number, args: Array<string>, program: ProgramSpec,
    reporter: ParserReporter, result: ParserResult, transition: ParserStateTransition) => void;

export type ParserStateTransition = (nextArgIndex: number, nextState: ParserState) => void;
