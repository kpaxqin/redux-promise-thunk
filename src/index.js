const START = 'START';
const COMPLETED = 'COMPLETED';
const FAILED = 'FAILED';
let steps = {
  [START]: 'START',
  [COMPLETED]: 'COMPLETED',
  [FAILED]: 'FAILED'
};

function createPromiseThunk(type, promiseCreator, metaCreator) {

  const typeMap = getTypeMap(type);
  const getType = step => typeMap[step];
  const getMeta = isFunction(metaCreator) ? metaCreator : getMetaByStep(metaCreator);

  function createActionForStep(step, payload) {
    return createAction(getType(step), payload, getMeta(step));
  }

  return data => dispatch => {
    dispatch(createActionForStep(START, data));

    const promise = promiseCreator.call(this, data);

    if (promise && promise.then) {
      promise.then((result)=>{
        dispatch(createActionForStep(COMPLETED, result));
      }, (err)=>{
        dispatch(createActionForStep(FAILED, err));
      });
    } else {
      throw new TypeError('The return of promiseCreator must be a promise object');
    }
  };
}

const setupSteps = customSteps => steps = {steps, ...customSteps};

const isArray = Array.isArray;//todo: polyfill
const isFunction = target => typeof target === 'function';

const getDefaultTypeByStep = type => step => `${type}_${steps[step]}`;

const getTypeMap = type => {
  if (isArray(type)) {
    const [startType, completedType, failedType] = type;

    return {
      [START]: startType,
      [COMPLETED]: completedType,
      [FAILED]: failedType
    }
  } else {
    return {
      [START]: getDefaultTypeByStep(type)(START),
      [COMPLETED]: getDefaultTypeByStep(type)(COMPLETED),
      [FAILED]: getDefaultTypeByStep(type)(FAILED)
    };
  }
};

const getMetaByStep = meta => step => ({asyncStep: step, ...meta});

function createAction(type, payload, meta) {
  const action = {
    type,
    payload,
    meta
  };

  if (payload instanceof Error) {
    action.error = true;
  }

  return action;
}


export default {
  createPromiseThunk,
  setupSteps,
  steps
};
