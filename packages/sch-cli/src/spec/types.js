/**
 * @flow
 */

import { Process } from '../types';

export interface CommandSpec {
    +args: Array<OptionSpec<*>>;
    +flags: { [name: string]: OptionSpec<*> };
    +name: string;
}

export interface GroupSpec {
    +commands: { [name: string]: CommandSpec };
    +groups: { [name: string]: GroupSpec };
    +name: string;
}

export interface OptionSpec<T: OptionType> {
    +defaultValue: T | Process => T;
    +multiple: boolean;
    +name: string;
    +optional: boolean;
    +sample: T;
}

export type OptionType = boolean | number | string;

export interface ProgramSpec {
    +commands: { [name: string]: CommandSpec };
    +groups: { [name: string]: GroupSpec };
}
