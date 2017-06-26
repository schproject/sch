/**
 * @flow
 */

import type { Command } from './command/types';
import type { Process } from './types';
import {
    parse,
    registry
} from './command';

export function run ({ argv, cwd, env }: Process) {
    const rawArgs = argv.slice(2),
        command = registry.find(...rawArgs);

    parse(rawArgs, command.lineSpec);
}
