/**
 * @flow
 */

import { createParser } from 'sch-cli-opts';
import type { Process } from 'sch-common';
import { registry } from './command';

export function run ({ argv, cwd, env }: Process) {
    const rawArgs = argv.slice(2),
        result = createParser(rawArgs, registry.spec).parse();
}
