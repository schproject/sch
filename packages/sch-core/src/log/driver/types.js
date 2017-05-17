/**
 * @flow
 */

export interface Driver {
    mkdir (path: string): Promise<void>;
    read (path: string): Promise<Uint8Array>;
    write (path: string, value: Uint8Array): Promise<void>;
}
