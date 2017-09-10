/**
 * @flow
 */

import { GroupSpec } from '../../spec';

import { CommandGroup } from '../types';

import init from './init';

export const group: CommandGroup = {
    commands: {
        init: init.command
    },
    groups: {}
}

export const spec: GroupSpec = {
    commands: {
        init: init.spec
    },
    groups: {}
};

export default {
    group,
    spec
};
