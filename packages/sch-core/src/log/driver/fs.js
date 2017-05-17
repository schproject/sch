/**
 * @flow
 */

import fs from 'fs';

import type { Driver } from './types';

export default class FS implements Driver {
    mkdir (path: string): Promise<void> {
        throw new Error('Not yet implemented');
    }

    read (path: string): Promise<Uint8Array> {
        throw new Error('Not yet implemented');
    }

    write (path: string, data: Uint8Array): Promise<void> {
        throw new Error('Not yet implemented');
    }
}
