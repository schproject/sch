/**
 * @flow
 */

import type { Command } from './command/types';
import type { Process } from './types';
import { registry } from './command';

export function run ({ argv, cwd, env }: Process) {
    const command: Command = registry.find(argv.slice(2));
}
