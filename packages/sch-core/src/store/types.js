/**
 * @flow
 */

export interface Store {
    ls (path: string): Promise<Array<string>>;
    mkdir (path: string): Promise<void>;
    read (path: string): Promise<Uint8Array>;
    write (path: string, value: Uint8Array): Promise<void>;
}
