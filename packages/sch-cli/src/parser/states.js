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
    }
}

export class InvalidFlagState implements ParserState {
    enter (args: Array<string>, context: ParserContext,
            programSpec: ProgramSpec) {
        context.transition(context.getArgIndex(), DONE);
    }
}

export class ParseCommandNameState implements ParserState {
    enter (args: Array<string>, context: ParserContext,
        programSpec: ProgramSpec) {
        const name = args[context.getArgIndex()]

        context.transition(context.getArgIndex() + 1,
            PARSE_FLAG_OR_ARG, { name, type: 'name' });
    }
}

export class ParseCommandOrGroupNameState implements ParserState {
    enter (args: Array<string>, context: ParserContext,
        programSpec: ProgramSpec) {
        const names = context.getResult().names;
        const nextName = args[context.getArgIndex()];

        const groupSpec = findGroupSpec(programSpec, names);

        if (!groupSpec) {
            // TODO: no groups found matching names 
        } else if (groupSpec.commands[nextName]) {
            context.transition(context.getArgIndex(), PARSE_COMMAND_NAME);
        } else if (groupSpec.groups[nextName]) {
            context.transition(context.getArgIndex(), PARSE_GROUP_NAME);
        } else {
            // TODO: no command or subgroup found matching next name
        }
    }
}

export class ParseGroupNameState implements ParserState {
    enter (args: Array<string>, context: ParserContext,
        programSpec: ProgramSpec) {
        const name = args[context.getArgIndex()];

        if (programSpec.groups[name]) {
            context.transition(context.getArgIndex() + 1,
                PARSE_COMMAND_OR_GROUP_NAME, { name, type: 'name' });
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
    enter (args: Array<string>, context: ParserContext,
            programSpec: ProgramSpec) {
        if (args[context.getArgIndex()].startsWith('-')) {
            context.transition(context.getArgIndex(), PARSE_FLAG);
        } else {
            context.transition(context.getArgIndex(), PARSE_ARG);
        }
    }
}

export class ParseFlagState implements ParserState {
    enter (args: Array<string>, context: ParserContext,
            programSpec: ProgramSpec) {
        const name = args[context.getArgIndex()],
            commandSpec = findCommandSpec(programSpec, context.getResult().names),
            valueIndex = context.getArgIndex() + 1;

        if (!commandSpec) {
            throw new IllegalStateEntryError(PARSE_FLAG);
        }

        const flagSpec = commandSpec.flags[name];

        if (!flagSpec) {
            context.transition(context.getArgIndex(), INVALID_FLAG);
            return
        }

        let rawValue;
        if (valueIndex < args.length && !args[valueIndex].startsWith('-')) {
            rawValue = args[valueIndex];
        } else if (typeof flagSpec.sample == 'boolean') {
            rawValue = true;
        } else {
            context.transition(context.getArgIndex(), INVALID_FLAG);
            return;
        }

        context.transition(context.getArgIndex() + 2,
            PARSE_FLAG_OR_ARG, { name, type: 'flag', rawValue });
    }
}

export class ParseFlagValueState implements ParserState {
    enter (args: Array<string>, parserContext: ParserContext,
            programSpec: ProgramSpec) {
    }
}
