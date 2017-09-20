/**
 * @flow
 */

import type { CommandSpec } from '../spec';
import type { PrimitiveType, PrimitiveArray, Process } from 'sch-common';

export interface Command {
    run (process: Process): void;
}

export interface CommandGroup {
    +commands: { [name: string]: Command };
    +groups: { [name: string]: CommandGroup };
}
 
export interface CommandOption<T: PrimitiveType> {
    +name: string;
    +value: T | PrimitiveArray<T>;
}
