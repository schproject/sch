/**
 * @flow
 */

import type { Command, CommandGroup, GroupSpec  } from 'sch-cli-opts';
import type { Process } from 'sch-common';

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
