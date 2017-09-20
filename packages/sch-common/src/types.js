/**
 * @flow
 */

export interface Builder<T> {
    +build: (void) => T;
}

export type PrimitiveArray<T: PrimitiveType> = Array<T>;
export type PrimitiveType = boolean | number | string;

export interface Process {
    argv: Array<string>;
    cwd: () => string;
    env: { [key: string]: string };
}
