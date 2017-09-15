/**
 * @flow
 */

export interface Process {
    argv: Array<string>;
    cwd: () => string;
    env: { [key: string]: string };
}

export type PrimitiveArray<T: PrimitiveType> = Array<T>;
export type PrimitiveType = boolean | number | string;
