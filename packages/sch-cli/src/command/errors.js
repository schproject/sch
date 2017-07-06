/**
 * @flow
 */

import type {
    Option,
    OptionType
} from './types';

export class DuplicateCommandNameError extends Error { 
    constructor (name: string) {
        super('There is already a command with name ' + name);
    }
}

export class IllegalOptionSampleTypeError extends Error {
    constructor (type: string) {
        super('"' + type + '" is not a legal option sample type');
    }
}

export class NoSuchCommandError extends Error { 
    constructor (name: string) {
        super('Failed to find command with name ' + name);
    }
}

export class ParserError<T: OptionType> extends Error {
    option: Option<T>;

    constructor (message: string, option: Option<T>) {
        super(message);
        this.option = option;
    }

    getOption (): Option<T> {
        return this.option;
    }
}

export class MissingOptionArgumentError<T: OptionType> extends ParserError<T> {
    constructor (option: Option<T>) {
        super(`Missing argument for option ${option.name}`, option);
    }
}
