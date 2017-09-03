/**
 * @flow
 */

import type {
    OptionSpec,
    OptionType
} from './types';

export class ParserError extends Error {}

export class IllegalStateEntryError extends ParserError {
    constructor(label: string) {
        super("It is not legal to enter this state [" + label + "]");
    }
}

export class StateNotFoundError extends ParserError {
    constructor(label: string) {
        super("Failed to find state with label [" + label + "]");
    }
}
