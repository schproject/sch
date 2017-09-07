/**
 * @flow
 */

import {
    CommandSpec,
    GroupSpec,
    ProgramSpec
} from './types';

export function findCommandSpec (spec: GroupSpec|ProgramSpec,
        names: Array<string>): ?CommandSpec {
    if (names.length == 0) {
        return null;
    }

    if (spec.commands[names[0]]) {
        return spec.commands[names[0]];
    }

    if (spec.groups[names[0]]) {
        return findCommandSpec(spec.groups[names[0]], names.slice(1));
    }

    return null;
}
