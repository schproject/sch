/**
 * @flow
 */

import type { OptionSpec } from '../spec';

export class ParserError extends Error {}

export class IllegalStateEntryError extends ParserError {
    constructor(message: string) {
        super("It is not legal to enter this state [" + message + "]");
    }
}

export class StateNotFoundError extends ParserError {
    constructor(label: string) {
        super("Failed to find state with label [" + label + "]");
    }
}
