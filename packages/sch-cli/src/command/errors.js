/**
 * @flow
 */

export class DuplicateCommandNameError extends Error { 
    constructor (name: string) {
        super('There is already a command with name ' + name);
    }
}

export class NoSuchCommandError extends Error { 
    constructor (name: string) {
        super('Failed to find command with name ' + name);
    }
}
