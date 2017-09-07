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
    GroupSpec,
    OptionSpec,
    ProgramSpec
} from '../spec';

import type {
    ParserState,
    StateTransition
} from './types';

export class DoneState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        throw new IllegalStateEntryError(DONE);
    }
}

export class InitialState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        transition(argIndex, PARSE_COMMAND_OR_GROUP_NAME);
    }
}

export class InvalidArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        console.error(args[argIndex], 'is an invalid arg');
    }
}

export class InvalidFlagState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        console.error(args[argIndex], 'is an invalid flag');
    }
}

export class ParseCommandNameState implements ParserState {
    enter (argIndex: number, args: Array<string>,
        programSpec: ProgramSpec, transition: StateTransition) {
        transition(argIndex + 1, PARSE_FLAG_OR_ARG, {
            name: args[argIndex]
        });
    }
}

export class ParseCommandOrGroupNameState implements ParserState {
    enter (argIndex: number, args: Array<string>,
        programSpec: ProgramSpec, transition: StateTransition) {
        const name = args[argIndex];

        if (programSpec.commands[name]) {
            transition(argIndex, PARSE_COMMAND_NAME);
        } else if (programSpec.groups[name]) {
            transition(argIndex, PARSE_GROUP_NAME);
        } else {
        }
    }
}

export class ParseGroupNameState implements ParserState {
    enter (argIndex: number, args: Array<string>,
        programSpec: ProgramSpec, transition: StateTransition) {
        const name = args[argIndex];

        if (programSpec.groups[name]) {
            transition(argIndex + 1, PARSE_COMMAND_OR_GROUP_NAME, {
                name: args[argIndex]
            });
        } else {
        }
    }
}

export class ParseArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        const flag = args[argIndex];
        console.log('Parsing arg', args[argIndex]);
    }
}

export class ParseFlagOrArgState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        if (args[argIndex].startsWith('-')) {
            transition(argIndex, PARSE_FLAG);
        } else {
            transition(argIndex, PARSE_ARG);
        }
    }
}

export class ParseFlagState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
        const name = args[argIndex];
        const valueIndex = argIndex + 1;

        if (valueIndex <= args.length) {
            const value = args[valueIndex];
            if (!value.startsWith('-')) {
                transition(argIndex + 2, PARSE_FLAG_OR_ARG, { name, value });
            }
        }
    }
}

export class ParseFlagValueState implements ParserState {
    enter (argIndex: number, args: Array<string>,
            programSpec: ProgramSpec, transition: StateTransition) {
    }
}
