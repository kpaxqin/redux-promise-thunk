import 'babel-core/polyfill';
import React, {Component} from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import App from './container/App'
import {Provider} from 'react-redux'
import reducers from './reducers'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import loadingMiddleWare from './middlewares/loadingMiddleWare'

const store = applyMiddleware(
  thunk,
  loadingMiddleWare,
  createLogger()
)(createStore)(reducers, {todos: [{text: 'adfsadsf', id: 0}]});

render(
  <Provider store={store}>
    <App/>
  </Provider>
  ,
  document.getElementById('app')
);