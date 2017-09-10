/**
 * @flow
 */

import {
    DONE,
    INITIAL,
    INVALID_ARG,
    INVALID_FLAG,
    PARSE_ARG,
    PARSE_COMMAND_NAME,
    PARSE_COMMAND_OR_GROUP_NAME,
    PARSE_GROUP_NAME,
    PARSE_FLAG,
    PARSE_FLAG_OR_ARG,
    PARSE_FLAG_VALUE
} from './labels';

import { IllegalStateEntryError } from './errors';

import  { OptionParser } from './parser';

import type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    ProgramSpec,
} from '../spec';

import { findCommandSpec } from '../spec';

import type {
    ParserContext,
    ParserState,
    ParserStateTransition
} from './types';

export class DoneState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        throw new IllegalStateEntryError(DONE);
    }
}

export class InitialState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        parserContext.transition(
            parserContext.getArgIndex(),
            PARSE_COMMAND_OR_GROUP_NAME
        );
    }
}

export class InvalidArgState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        console.error(args[parserContext.getArgIndex()], 'is an invalid arg');
    }
}

export class InvalidFlagState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        console.error(args[parserContext.getArgIndex()], 'is an invalid flag');
    }
}

export class ParseCommandNameState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
        programSpec: ProgramSpec) {
        const name = args[parserContext.getArgIndex()]

        parserContext.transition(
            parserContext.getArgIndex() + 1,
            PARSE_FLAG_OR_ARG,
            { name, type: 'name' }
        );
    }
}

export class ParseCommandOrGroupNameState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
        programSpec: ProgramSpec) {
        const name = args[parserContext.getArgIndex()];

        if (programSpec.commands[name]) {
            parserContext.transition(
                parserContext.getArgIndex(),
                PARSE_COMMAND_NAME
            );
        } else if (programSpec.groups[name]) {
            parserContext.transition(
                parserContext.getArgIndex(),
                PARSE_GROUP_NAME
            );
        } else {
        }
    }
}

export class ParseGroupNameState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
        programSpec: ProgramSpec) {
        const name = args[parserContext.getArgIndex()];

        if (programSpec.groups[name]) {
            parserContext.transition(
                parserContext.getArgIndex() + 1,
                PARSE_COMMAND_OR_GROUP_NAME,
                { name, type: 'name' }
            );
        } else {
        }
    }
}

export class ParseArgState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        const result = parserContext.getResult();
        const commandSpec = findCommandSpec(programSpec, result.names);
    }
}

export class ParseFlagOrArgState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        if (args[parserContext.getArgIndex()].startsWith('-')) {
            parserContext.transition(
                parserContext.getArgIndex(),
                PARSE_FLAG
            );
        } else {
            parserContext.transition(
                parserContext.getArgIndex(),
                PARSE_ARG
            );
        }
    }
}

export class ParseFlagState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
        const name = args[parserContext.getArgIndex()];
        const valueIndex = parserContext.getArgIndex() + 1;

        if (valueIndex <= args.length) {
            const value = args[valueIndex];
            if (!value.startsWith('-')) {
                parserContext.transition(
                    parserContext.getArgIndex() + 2,
                    PARSE_FLAG_OR_ARG,
                    { name, type: 'flag', value }
                );
            }
        }
    }
}

export class ParseFlagValueState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
    }
}
