/**
 * @flow
 */

export type { Command, CommandGroup } from './command';
export type { Parser, ParserError, ParserResult } from './parse';
export { createParser } from './parse';
export { Registry, RegistryBuilder } from './registry';
export { registryBuilder } from './registry';
export type { CommandSpec, OptionSpec,
    NamedOptionSpec, ProgramSpec } from './spec';
export { specBuilder } from './spec';
