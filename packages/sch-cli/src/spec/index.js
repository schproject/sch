/**
 * @flow
 */

export type {
    CommandSpec,
    GroupSpec,
    OptionSpec,
    OptionType,
    ProgramSpec
} from './types';

export { default as specBuilder } from './builder';

export { findCommandSpec } from './util';
