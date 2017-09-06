/**
 * @flow
 */

import type { Process } from './types';
import { createParser } from './parser';

export function run ({ argv, cwd, env }: Process) {
    const rawArgs = argv.slice(2),
        parser = createParser();
}
