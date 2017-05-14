/**
 * @flow
 */

export interface Process {
    argv: Array<string>;
    env: { [key: string]: string };
}

export interface Command {
    run (process: Process): void;
}

class A implements Command {
    run(process: Process) {
    }
}
