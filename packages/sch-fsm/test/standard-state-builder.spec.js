/**
 * @flow
 */

import { expect } from 'chai';

import { IllegalStateError } from '../src/errors';
import type { StateBuilder, StateIdRegistry } from '../src/types';
import { StandardStateBuilder } from '../src/state';
import { TestContext, TestTransition } from './util';

describe('StandardStateBuilder', function () {
    let contextClass: Class<TestContext> = TestContext,
        stateBuilder: StateBuilder<TestContext>,
        transitionFactory = function(stateIdRegistry: StateIdRegistry) {
            const someStateId = stateIdRegistry.get('some-state-id');

            return context => someStateId;
        };

    beforeEach(function () {
        stateBuilder = new StandardStateBuilder(TestContext);
    });

    describe('#build', function () {
        context('when no id has been supplied', function() {
            beforeEach(function() {
                stateBuilder.transition(transitionFactory);
            });

            it('throws an IllegalStateError', function() {
                expect(() => stateBuilder.build())
                    .to.throw(IllegalStateError, 'Cannot build a state without an id');
            });
        });
    });

    describe('#id', function () {
        it('returns its instance', function() {
            expect(stateBuilder.id('some-id')).to.equal(stateBuilder);
        });
    });

    describe('#initial', function () {
        it('returns its instance', function() {
            expect(stateBuilder.initial()).to.equal(stateBuilder);
        });
    });

    describe('#transition', function () {
        it('returns its instance', function() {
            expect(stateBuilder.transition(transitionFactory)).to.equal(stateBuilder);
        });
    });
});
