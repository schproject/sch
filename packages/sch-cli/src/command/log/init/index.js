/**
 * @flow
 */

import type { Command } from '../../types';

import run from './run';
import spec from './spec';

const init: Command = { run, spec };

export default init;
