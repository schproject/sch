/**
 * @flow
 */

import { expect } from 'chai';

import type { State, StateId } from '../src/types';
import { StandardState } from '../src/state';
import { TestContext } from './util';

describe('StandardState', function () {
    let contextClass: Class<TestContext> = TestContext,
        initial = false,
        state: State<TestContext>,
        stateId: StateId = 'state-id',
        transition = (context: TestContext) => stateId,
        transitionsTo = ['some-other-state-id', 'yet-another-state-id'];

    beforeEach(function() {
        state = new StandardState(contextClass, stateId, initial, transition, transitionsTo);
    });

    describe('#id', function () {
        [ stateId, 'alternate-state-id-1', 'alternate-state-id-1' ].forEach(function (alternateStateId) {
            context(`when the value '${alternateStateId}' is passed to the constructor as the stateId parameter`, function () {
                before(function() {
                    stateId = alternateStateId;
                });

                it(`equals the value (${alternateStateId}) assigned at construction`, function() {
                    expect(state.id()).to.equal(alternateStateId);
                });
            });
        });
    });

    describe('#initial', function() {
        [ true, false ].forEach(function (initialValue) {
            const initialValueAsString: string = String(initialValue);

            context(`when ${initialValueAsString} is passed to the constructor as the initial value`, function() {
                before(function() {
                    initial = initialValue;
                });

                it(`equals the value ${initialValueAsString} assigned at construction`, function() {
                    expect(state.initial()).to.equal(initialValue);
                });
            });
        });
    });

    describe('#transition', function () {
        it('equals the value assigned at construction', function() {
            expect(state.transition()).to.equal(transition);
        });
    });

    describe('#transitionsTo', function () {
        it('has a length equal to that of the array passed to the constructor\'s transitionsTo parameter', function() {
            expect(state.transitionsTo()).to.have.lengthOf(transitionsTo.length);
        });

        it('contains all of the items in the array passed to the constructor\'s transitionsTo parameter', function () {
            expect(state.transitionsTo()).to.have.members(transitionsTo);
        });
    });
});
