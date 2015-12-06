# redux-promise-thunk

This lib can help you dispatch FSA(flux standard action) in each phase of your promise;

You need to use `redux-thunk` as one of your middleware to make this lib work. async

###createPromiseThunk(actionName, promiseCreator [, metaCreator])

createPromiseThunk will return a `high-order function` like `data=>dispatch=>{}`:
You can pass data to it just like other action creators, but instead of action object, it returns a thunk function, which will be processed by `redux-thunk`.

promiseCreator(data) accept the data you passed into our 'action creator', and must return a Promise(or thenable) object. 
Our thunk function will dispatch following actions for that promise:

#### START action
Dispatch before promiseCreator been called, payload will be the first argument of promiseCreator;
```js
  {
    type: `${actionName}_START`,
    payload: data,
    meta: {
      asyncStep: 'START'
    }
  }
```
#### COMPLETED action
Dispatch when promise fulfilled, payload will be the value which fulfilled this promise.
```js
  {
    type: `${actionName}_COMPLETED`,
    payload: value,
    meta: {
      asyncStep: 'COMPLETED'
    }
  }
```
####
FAILED action
Dispatch when promise rejected, payload will be the error object which reject this promise.
```js
  {
    type: `${actionName}_FAILED`
    payload: error,
    meta: {
      asyncStep: 'FAILED'
    }
  }
```

example: 
```js
//actions.js
const editTodo = createPromiseThunk('EDIT_TODO', function(todo) {
  return promiseApi(todo);
});

//TodoItem.jsx
const actions = bindActionCreators(actions, dispatch);

handleEdit(todo){
  editTodo(todo);
}
```

