export class MachineError extends Error {}

export class DuplicateStateIdError extends MachineError {}
export class IllegalTransitionError extends MachineError {}
export class MissingIdError extends MachineError {}
export class MissingInitialStateError extends MachineError {}
export class MissingTransitionError extends MachineError {}
export class MultipleInitialStatesError extends MachineError {}
export class TransitionAlreadyDefinedError extends MachineError {}
