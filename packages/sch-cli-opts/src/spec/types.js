/**
 * @flow
 */

import { Process } from 'sch-common';
import type { Registry } from '../registry';

export interface CommandSpec {
    +args: (void) => Array<NamedOptionSpec<*>>;
    +flags: (void) => { [name: string]: OptionSpec<*> };
}

export interface NamedOptionSpec<T: OptionType> {
    +defaultValue: (Process) => T;
    +multiple: (void) => boolean;
    +name: (void) => string;
    +optional: (void) => boolean;
    +sample: (void) => T;
}

export interface OptionSpec<T: OptionType> {
    +defaultValue: (Process) => T;
    +multiple: (void) => boolean;
    +optional: (void) => boolean;
    +sample: (void) => T;
}

export type OptionType = boolean | number | string;

export type ProgramSpec = Registry<CommandSpec>;
