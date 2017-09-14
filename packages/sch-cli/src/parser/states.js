/**
 * @flow
 */

import { IllegalStateEntryError } from './errors';

import  { OptionParser } from './parser';

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
    ParserState,
    ParserStateTransition
} from './types';

export const Done: ParserState = function (args: Array<string>,
        parserContext: ParserContext, programSpec: ProgramSpec) {
    throw new IllegalStateEntryError('Cannot enter the done state');
}

export const Initial: ParserState = function (args: Array<string>,
        parserContext: ParserContext, programSpec: ProgramSpec) {
    parserContext.transition(parserContext.getArgIndex(),
        ParseCommandOrGroupName
    );
}

export const InvalidArg: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    context.terminate({ type: 'invalid-arg' });
}

export const InvalidFlag: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    context.terminate({ type: 'invalid-flag' });
}

export const InvalidName: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    context.terminate({ type: 'invalid-name' });
}

export const ParseArg: ParserState = function (args: Array<string>,
        parserContext: ParserContext, programSpec: ProgramSpec) {
    const result = parserContext.getResult();
    const commandSpec = findCommandSpec(programSpec, result.names);
}

export const ParseCommandName: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    const name = args[context.getArgIndex()];

    context.transition(context.getArgIndex() + 1,
        ParseFlagOrArg, { name, type: 'name' });
}

export const ParseCommandOrGroupName: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    const names = context.getResult().names;
    const nextName = args[context.getArgIndex()];

    const groupSpec = findGroupSpec(programSpec, names);

    if (!groupSpec) {
        throw new IllegalStateEntryError('No group spec found');
    } else if (groupSpec.commands[nextName]) {
        context.transition(context.getArgIndex(), ParseCommandName);
    } else if (groupSpec.groups[nextName]) {
        context.transition(context.getArgIndex(), ParseGroupName);
    } else {
        context.terminate({ type: 'invalid-name' });
    }
}

export const ParseFlagOrArg: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    if (args[context.getArgIndex()].startsWith('-')) {
        context.transition(context.getArgIndex(), ParseFlag);
    } else {
        context.transition(context.getArgIndex(), ParseArg);
    }
}

export const ParseFlag: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    const name = args[context.getArgIndex()],
        commandSpec = findCommandSpec(programSpec, context.getResult().names),
        valueIndex = context.getArgIndex() + 1;

    if (!commandSpec) {
        throw new IllegalStateEntryError('No command spec found');
    }

    const flagSpec = commandSpec.flags[name];

    if (!flagSpec) {
        context.terminate({ type: 'invalid-flag' });
    } else {
        let rawValue;
        if (valueIndex < args.length && !args[valueIndex].startsWith('-')) {
            rawValue = args[valueIndex];
        } else if (typeof flagSpec.sample == 'boolean') {
            rawValue = true;
        }

        if (!rawValue) {
            context.terminate({ type: 'no-value-found-for-flag' });
        } else if (!flagSpec.multiple && context.getResult().flags[name]) {
            context.terminate({ type: 'multiple-values-not-allowed' });
        } else {
            context.transition(context.getArgIndex() + 2,
                ParseFlagOrArg, { name, type: 'flag', rawValue });
        }
    }
}

export const ParseFlagValue: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    const name = args[context.getArgIndex()],
        commandSpec = findCommandSpec(programSpec, context.getResult().names),
        valueIndex = context.getArgIndex() + 1;

    if (!commandSpec) {
        throw new IllegalStateEntryError('No command spec found');
    }

    const flagSpec = commandSpec.flags[name];

    if (!flagSpec) {
        throw new IllegalStateEntryError('No flag spec found');
    }
}

export const ParseGroupName: ParserState = function (args: Array<string>,
        context: ParserContext, programSpec: ProgramSpec) {
    const name = args[context.getArgIndex()];

    if (programSpec.groups[name]) {
        context.transition(context.getArgIndex() + 1,
            ParseCommandOrGroupName, { name, type: 'name' });
    } else {
    }
}

export default {
    Done,
    Initial,
    InvalidArg,
    InvalidFlag,
    InvalidName,
    ParseArg,
    ParseCommandName,
    ParseCommandOrGroupName,
    ParseFlagOrArg,
    ParseFlag,
    ParseFlagValue,
    ParseGroupName
}
