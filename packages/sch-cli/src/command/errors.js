/**
 * @flow
 */

export class DuplicateCommandNameError extends Error { 
    constructor (name: string) {
        super('There is already a command with name ' + name);
    }
}

export class IllegalOptionSampleType extends Error {
    constructor (type: string) {
        super('"' + type + '" is not a legal option sample type');
    }
}


export class NoSuchCommandError extends Error { 
    constructor (name: string) {
        super('Failed to find command with name ' + name);
    }
}
