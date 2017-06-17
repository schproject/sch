/**
 * @flow
 */

import type {
    Command
} from './types';

import type { Process } from '../types';

import {
    NoSuchCommandError
} from './errors';

export const DEFAULT_KEY = '_default';

export default class Registry {
    entries: { [name: string]: Command|Registry };

    constructor (entries: { [name: string]: Command|Registry }) {
        this.entries = entries;
    }

    find (...keys: Array<string>): Command {
        const [ firstKey, ...otherKeys ] = keys || [ DEFAULT_KEY ];

        let entry: Command|Registry;

        if (this.entries.hasOwnProperty(firstKey)) {
            entry = this.entries[firstKey];
        } else if (this.entries.hasOwnProperty(DEFAULT_KEY)) {
            entry = this.entries[DEFAULT_KEY];
        } else {
            throw new NoSuchCommandError(firstKey);
        }
        
        if (entry instanceof Registry) {
            return entry.find(...otherKeys);
        } else {
            return entry;
        }
    }
}
