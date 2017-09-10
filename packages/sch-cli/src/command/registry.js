/**
 * @flow
 */

import type { GroupSpec } from '../spec';
import type { Process } from '../types';

import type {
    Command,
    CommandGroup
} from './types';

import log from './log';

const group: CommandGroup = {
    commands: {},
    groups: {
        log: log.group
    }
}

const spec: GroupSpec = {
    commands: {},
    groups: {
        log: log.spec
    }
}

export default {
    group,
    spec
};
