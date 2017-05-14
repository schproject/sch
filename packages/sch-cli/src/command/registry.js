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

    getOrDefault (name: string) {
        if (this.commands.hasOwnProperty(name)) {
            return this.commands[name];
        } else if (this.commands.hasOwnProperty('default')) {
            return this.commands['default'];
        }

        throw new NoSuchCommandError(name);
    }

    run (process: Process) {
        const [
            name,
            ...options
        ] = process.argv;

        this.getOrDefault(name).run({
            argv: options,
            cwd: process.cwd,
            env: process.env
        });
    }
}
