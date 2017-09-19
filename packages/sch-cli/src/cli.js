/**
 * @flow
 */

import { registry } from './command';
import type { ProgramSpec } from './spec';
import type { Process } from './types';
import type { Parser } from './parser';
import { createParser } from './parser';

export function run ({ argv, cwd, env }: Process) {
    const rawArgs = argv.slice(2),
        parser: Parser = createParser(rawArgs, registry.spec);

    parser.parse();
}
