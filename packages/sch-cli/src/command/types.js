/**
 * @flow
 */

import type { CommandSpec } from '../spec';
import type { Process } from '../types';

export interface Command {
    run (process: Process): void;
}

export interface CommandGroup {
    +commands: { [name: string]: Command };
    +groups: { [name: string]: CommandGroup };
}
 
export interface CommandOption<T: CommandOptionValue> {
    +name: string;
    +value: T;
}

export type CommandOptionValue =
    | Array<boolean>
    | Array<number>
    | Array<string>
    | boolean
    | number
    | string;
