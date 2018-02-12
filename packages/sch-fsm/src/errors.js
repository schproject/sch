/**
 * @flow
 */

export class MachineError extends Error {}

export class DuplicateStateIdError extends MachineError {}
export class ExecutorAlreadyDefinedError extends MachineError {}
export class IllegalTransitionError extends MachineError {}
export class MissingExecutorError extends MachineError {}
export class MissingIdError extends MachineError {}
export class MissingInitialStateError extends MachineError {}
export class MultipleInitialStatesError extends MachineError {}
