/**
 * @flow
 */

import loglevel from 'loglevel';

import { IllegalStateEntryError } from './errors';

import type { CommandSpec, OptionSpec, ProgramSpec, } from '../spec';

import type { ParserContext, ParserReporter,
    ParserResult, ParserState, ParserStateTransition } from './types';

export const Done: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec,
        report: ParserReporter, result: ParserResult,
        transition: ParserStateTransition) {
    throw new IllegalStateEntryError('Cannot enter the done state');
}

export const Initial: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec,
        reporter: ParserReporter, result: ParserResult,
        transition: ParserStateTransition) {
    transition(argIndex, ParseCommandOrGroupName);
}

export const InvalidArg: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    report.error({ type: 'invalid-arg' });
    transition(argIndex, Done);
}

export const InvalidFlag: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    report.error({ type: 'invalid-flag' });
    transition(argIndex, Done);
}

export const InvalidFlagValue: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    report.error({ type: 'invalid-flag-value' });
    transition(argIndex, Done);
}

export const InvalidName: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    report.error({ type: 'invalid-name' });
    transition(argIndex, Done);
}

export const ParseArg: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
}

export const ParseCommandOrGroupName: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
}

export const ParseFlag: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    const name = args[argIndex],
        commandSpec = result.command();

    const spec = commandSpec.flags[name];

    if (spec == null) {
        transition(argIndex, InvalidFlag);
    } else {
        report.flag(name, spec);
        transition(argIndex, ParseFlagValue);
    }
}

export const ParseFlagOrArg: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    if (args[argIndex].startsWith('-')) {
        transition(argIndex, ParseFlag);
    } else {
        transition(argIndex, ParseArg);
    }
}

export const ParseFlagValue: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    const log = loglevel.getLogger(`${__filename}:${ParseFlagValue.name}`),
        [ name, value ] = args.slice(argIndex, argIndex + 2),
        { spec } = result.flag(name);

    if (!value || value.startsWith('-')) {
        if (typeof spec.sample == 'boolean') {
            report.flagValue(name, true);
            transition(argIndex + 2, ParseFlagOrArg);
        } else {
            log.debug(`failed to parse flag ${name} value ${value}`);
            transition(argIndex, InvalidFlagValue);
        }
    } else {
        const sample = spec.sample();
        report.flagValue(name, (value: typeof sample));
        transition(argIndex + 2, ParseFlagOrArg);
    }
}

export default {
    Done,
    Initial,
    InvalidArg,
    InvalidFlag,
    InvalidFlagValue,
    InvalidName,
    ParseArg,
    ParseCommandOrGroupName,
    ParseFlagOrArg,
    ParseFlag,
    ParseFlagValue
}
