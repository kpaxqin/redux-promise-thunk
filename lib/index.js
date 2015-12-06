'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var steps = {
  START: 'START',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

function isFunction(target) {
  return typeof target === 'function';
}

function createAction(type, payload, meta) {
  var action = {
    type: type,
    payload: payload,
    meta: meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}

function getTypeByStep(type) {
  return function (step) {
    return type + '_' + step;
  };
}

function getMetaByStep(meta) {
  return function (step) {
    return Object.assign({
      asyncStep: step
    }, meta);
  };
}

function createPromiseThunk(type, promiseCreator, metaCreator) {
  var _this = this;

  var meta = isFunction(metaCreator) ? metaCreator() : metaCreator;

  var getType = getTypeByStep(type);
  var getMeta = getMetaByStep(meta);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step));
  }

  return function (data) {
    return function (dispatch) {
      dispatch(createActionForStep(steps.START, data));

      var promise = promiseCreator.call(_this, data);

      if (promise && promise.then) {
        promise.then(function (result) {
          dispatch(createActionForStep(steps.COMPLETED, result));
        })['catch'](function (err) {
          dispatch(createActionForStep(steps.FAILED, err));
        });
      } else {
        throw new TypeError('The return of promiseCreator must be a promise object');
      }
    };
  };
}

exports['default'] = {
  createPromiseThunk: createPromiseThunk,
  steps: steps
};
module.exports = exports['default'];