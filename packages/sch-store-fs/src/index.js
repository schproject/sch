/**
 * @flow
 */

import fs from 'fs';

import type { Store } from 'sch-core';

export default class FS implements Store {
    ls (path: string): Promise<Array<string>> {
        throw new Error('Not yet implemented');
    }

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
