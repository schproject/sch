/**
 * @flow
 */

export type { Command } from './types';

import Registry from './registry';
import log from './log';
export const registry = new Registry({ log });
