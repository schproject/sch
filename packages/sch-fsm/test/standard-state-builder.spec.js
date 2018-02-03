/**
 * @flow
 */

import { expect } from 'chai';

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
