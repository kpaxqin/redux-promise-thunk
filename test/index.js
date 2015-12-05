import {steps, createPromiseThunk} from '../src/index';
import chai, {assert} from 'chai';
import sinon from 'sinon';

describe('redux promise thunk: ', function() {
  describe('method createPromiseThunk', function() {
    const actionName = 'TEST_ACTION';
    let actionHandler;
    let dispatch ;

    function invokeThunk(thunk) {
      thunk(dispatch);
    }

    beforeEach(function() {
      actionHandler = createPromiseThunk(actionName, function(data) {
        return Promise.resolve(data);
      });
      dispatch = sinon.spy();
    });

    it('should return handler function which accept one argument', function() {
      assert.strictEqual(typeof actionHandler, 'function');
      assert.strictEqual(actionHandler.length, 1);
    });

    it('should return thunk function when handler function been called', function() {
      assert.strictEqual(typeof actionHandler(1), 'function');
    });

    context('when thunk function been excuted', function() {
      it('should invoke promiseCreator with argument passed to handler', function() {
        const promiseCreator = sinon.spy(function(data) {
          return Promise.resolve(data);
        });

        actionHandler = createPromiseThunk(actionName, promiseCreator);

        invokeThunk(actionHandler(1));

        assert(promiseCreator.calledWith(1));
      });

      it('should throw TypeErrot when return of promiseCreator is not a promise', function() {
        const promiseCreator = sinon.spy(function(data) {
          return {};
        });

        actionHandler = createPromiseThunk(actionName, promiseCreator);

        try{
          invokeThunk(actionHandler(1));
        } catch(e) {
          assert(e instanceof TypeError);
        }
      });

      it('should dispatch start action', function() {
        const data = 1;

        invokeThunk(actionHandler(data));

        const action = dispatch.args[0][0];

        assert.strictEqual(action.type, `${actionName}_${steps.START}`);
        assert.strictEqual(action.payload, data);
        assert.strictEqual(action.meta.asyncStep, steps.START);
      });
    });

    context('when promise resolved', function() {
      it('should dispatch completed action', function() {
        actionHandler = createPromiseThunk(actionName, function(data) {
          const result = data + 1;
          return new Promise(function(resolve, reject) {
            resolve(result);

            const action = dispatch.args[1][0];

            assert.strictEqual(action.type, `${actionName}_${steps.COMPLETED}`);
            assert.strictEqual(action.payload, result);
            assert.strictEqual(action.meta.asyncStep, steps.COMPLETED);
          });
        });
        invokeThunk(actionHandler(1));
      });
    });

    context('when promise reject', function() {
      it('should dispatch failed action', function() {
        actionHandler = createPromiseThunk(actionName, function(data) {
          return new Promise(function(resolve, reject) {
            reject(new Error());

            const action = dispatch.args[1][0];

            assert.strictEqual(action.type, `${actionName}_${steps.FAILED}`);
            assert(action.payload instanceof Error);
            assert(action.error);
            assert.strictEqual(action.meta.asyncStep, steps.FAILED);
          });
        });
        invokeThunk(actionHandler(1));
      });
    })
  })
});
