/**
 * @flow
 */

import type { Command, Process } from './types';

import {
    DuplicateCommandNameError,
    NoSuchCommandError
} from './errors';

export default class Registry implements Command {
    commands: { [name: string]: Command };

    constructor (commands: { [name: string]: Command }) {
        this.commands = commands;
    }

    add (name: string, command: Command) {
        if (this.commands.hasOwnProperty(name)) {
            throw new DuplicateCommandNameError(name);
        }

        this.commands[name] = command;
    }

    get (name: string) {
        if (!this.commands.hasOwnProperty(name)) {
            throw new NoSuchCommandError(name);
        }

        return this.commands[name];
    }

    run (process: Process) {
        const [
            name,
            ...options
        ] = process.argv;

        this.get(name).run({
            argv: options,
            env: process.env
        });
    }
}
