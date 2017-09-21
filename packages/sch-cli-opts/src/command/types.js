/**
 * @flow
 */

import type { PrimitiveType, PrimitiveArray } from 'sch-common';

export type Command = (args: { [name: string]: PrimitiveType | PrimitiveArray<*> }) => void;

export interface CommandGroup {
    +commands: { [name: string]: Command };
    +groups: { [name: string]: CommandGroup };
}

export type CommandRegistry = CommandGroup;
