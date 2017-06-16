# redux-promise-thunk


**This lib is out of date, please checkout [redux-action-tools](https://github.com/kpaxqin/redux-action-tools) for more handy tools**


This lib can help you dispatch FSA(flux standard action) in each phase of your promise;

You need to use [redux thunk](http://npmjs.com/package/redux-thunk) as one of your middleware to make this lib work.

## Install
`npm i redux-promise-thunk`

## Usage

### createPromiseThunk(actionName, promiseCreator [, metaCreator])

`createPromiseThunk` will create an `action creator`, but instead of action object, it returns a thunk function, which will be processed by `redux-thunk`.

The action creator created by `createPromiseThunk` only receives **one** parameter and will pass it to `promiseCreator`. Example: 

```js
//editTodo is a thunk
const editTodo = createPromiseThunk('EDIT_TODO', function(todo) {
  return todoApi.edit(todo); //todoApi.edit() should return a Promise object;
});

//TodoItem.jsx
const {editTodo} = bindActionCreators(actions, dispatch);

class TodoItem extends Component {
  //...
  handleEdit(todo) {
    editTodo(todo);//only one parameter is allowed, and will be passed to promiseCreator;
  }
  //...
}
```

The thunk function will dispatch following flux standard actions(FSA) for the promise you returned in promiseCreator:

|     Name           | When         |  payload  | meta.asyncStep    |
| --------           |  -----      | :----:    | :----:  |
| `${actionName}_START` | promiseCreator(data) been called | first argument of promiseCreator | 'START' |
| `${actionName}_COMPLETED` | promise resolved | value of promise | 'COMPLETED' |
| `${actionName}_FAILED` | promise rejected | reason of promise | 'FAILED' |

## Example
Check `examples/todo-mvc` for further info, the `TodoActions.editTodo` shows optimistic update with composed thunk. and 
`loadingMiddleWare` shows how to do some *aspect* things like loading label with `action.meta.asyncStep`

