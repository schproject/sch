/**
 * @flow
 */

import { Process } from '../types';

export interface CommandGroup {
    +commands: Array<CommandGroup | CommandSpec>;
    +name: string
}

export interface CommandSpec {
    +args: Array<OptionSpec<*>>;
    +flags: { [name: string]: OptionSpec<*> };
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
