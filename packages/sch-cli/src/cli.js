/**
 * @flow
 */

import type { Command } from './command/types';
import type { Process } from './types';
import { createParser } from './parser';
import { registry } from './command';

export function run ({ argv, cwd, env }: Process) {
    const rawArgs = argv.slice(2),
        { argIndex, command } = registry.find(...rawArgs),
        parser = createParser();

    parser.parse(rawArgs.slice(argIndex), command.commandSpec);
}
