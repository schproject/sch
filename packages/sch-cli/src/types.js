/**
 * @flow
 */

export interface Process {
    argv: Array<string>;
    cwd: () => string;
    env: { [key: string]: string };
}
