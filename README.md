# redux-promise-thunk

This lib can help you dispatch FSA(flux standard action) in each phase of your promise;

You need to use `redux-thunk` as one of your middleware to make this lib work. async

## Install
`npm i redux-promise-thunk`

## Usage

### createPromiseThunk(actionName, promiseCreator [, metaCreator])

createPromiseThunk will return a `high-order function` like `data=>dispatch=>{}`:
You can pass data to it just like other action creators, but instead of action object, it returns a thunk function, which will be processed by `redux-thunk`.

promiseCreator(data) accept the data you passed into our 'action creator', and must return a Promise(or thenable) object. 
The thunk function will dispatch following flux standard actions(FSA) for that promise:

|     Name           | When         |  payload  | meta.asyncStep    |
| --------           |  -----      | :----:    | :----:  |
| `${actionName}_START` | promiseCreator(data) been called | first argument of promiseCreator | 'START' |
| `${actionName}_COMPLETED` | promise resolved | value of promise | 'COMPLETED' |
| `${actionName}_FAILED` | promise rejected | reason of promise | 'FAILED' |


## Example
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

Check `./examples/todo-mvc` for further info.

