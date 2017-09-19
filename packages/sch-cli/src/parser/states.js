/**
 * @flow
 */

import { IllegalStateEntryError } from './errors';

import type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    ProgramSpec,
} from '../spec';

import typeof {
    CommandSpec as CommandSpecType,
    GroupSpec as GroupSpecType
} from '../spec';

import {
    findCommandSpec,
    findGroupSpec
} from '../spec';

import type {
    ParserContext,
    ParserReporter,
    ParserResult,
    ParserState,
    ParserStateTransition
} from './types';

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
    const names = result.groups().map(group => group[0]),
        groupSpec = findGroupSpec(program, names),
        nextName = args[argIndex];

    if (groupSpec == null) {
        throw new IllegalStateEntryError('No group spec found');
    }

    if (groupSpec.commands[nextName]) {
        report.command(groupSpec.commands[nextName]);
        transition(argIndex + 1, ParseFlagOrArg);
    } else if (groupSpec.groups[nextName]) {
        report.group(nextName, groupSpec.groups[nextName]);
        transition(argIndex + 1, ParseCommandOrGroupName);
    } else {
        transition(argIndex, InvalidName);
    }
}

export const ParseFlag: ParserState = function (argIndex: number,
        args: Array<string>, program: ProgramSpec, report: ParserReporter,
        result: ParserResult, transition: ParserStateTransition) {
    const name = args[argIndex],
        commandSpec = result.command(),
        valueIndex = argIndex + 1;

    const spec = commandSpec.flags[name];

    if (spec == null) {
        transition(argIndex, InvalidFlag);
    } else {
        report.flag(name, { spec });
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
    const [ name, value ] = args.slice(argIndex, argIndex + 1),
        { spec } = result.flag(name);

    if (!value || value.startsWith('-')) {
        if (typeof spec.sample == 'boolean') {
            report.flag(name, { spec, value: true });
            transition(argIndex + 2, ParseFlagOrArg);
        } else {
            transition(argIndex, InvalidFlagValue);
        }
    } else {
        report.flag(name, {
            spec,
            value: (value: typeof spec.sample)
        });
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
