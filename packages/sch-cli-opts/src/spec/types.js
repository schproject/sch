/**
 * @flow
 */

import { Process } from '../types';

export interface CommandSpec {
    +args: Array<NamedOptionSpec<*>>;
    +flags: { [name: string]: OptionSpec<*> };
}

export interface GroupSpec {
    +commands: { [name: string]: CommandSpec };
    +groups: { [name: string]: GroupSpec };
}

export interface NamedGroupSpec {
    +commands: { [name: string]: CommandSpec };
    +groups: { [name: string]: GroupSpec };
    name: string;
}

export interface NamedOptionSpec<T: OptionType> {
    +defaultValue: T | Process => T;
    +multiple: boolean;
    +name: string;
    +optional: boolean;
    +sample: T;
}

export interface OptionSpec<T: OptionType> {
    +defaultValue: T | Process => T;
    +multiple: boolean;
    +optional: boolean;
    +sample: T;
}

export type OptionType = boolean | number | string;

export type ProgramSpec = GroupSpec;
