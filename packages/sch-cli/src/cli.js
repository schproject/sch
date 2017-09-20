/**
 * @flow
 */

import loglevel from 'loglevel';

import { registry } from './command';
import type { ProgramSpec } from './spec';
import type { Process } from './types';
import type { Parser } from './parser';
import { createParser } from './parser';

export function run ({ argv, cwd, env }: Process) {
    loglevel.setLevel('debug');

    const rawArgs = argv.slice(2),
        result = createParser(rawArgs, registry.spec).parse();
}
