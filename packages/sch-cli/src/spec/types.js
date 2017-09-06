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
    +subgroups: { [name: string]: NamedGroupSpec };
}

export interface NamedGroupSpec {
    +commands: { [name: string]: CommandSpec };
    +name: string;
    +subgroups: { [name: string]: NamedGroupSpec };
}

export interface OptionSpec<T: OptionType> {
    +defaultValue: T | Process => T;
    +multiple: boolean;
    +name: string;
    +optional: boolean;
    +sample: T;
}

export type OptionType = boolean | number | string;
