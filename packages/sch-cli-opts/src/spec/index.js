/**
 * @flow
 */

export type { CommandSpec, GroupSpec, OptionSpec,
    NamedGroupSpec, NamedOptionSpec, ProgramSpec } from './types';

export { default as specBuilder } from './builder';

export {
    findCommandSpec,
    findGroupSpec
} from './util';
