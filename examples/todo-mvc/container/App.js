import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import 'todomvc-app-css/index.css'
import TodoActions, {addTodo } from '../actions/TodoActions.js'
import Header from '../components/Header.jsx'
import TodoList from '../components/TodoList.js'

class App extends Component {
  render(){
    const {dispatch, todos, isLoading} = this.props;
    const actions = bindActionCreators(TodoActions, dispatch)
    return (
      <div className="todoapp">
        <Header
          isLoading = {isLoading}
          onAddTodo={(text)=>{
            dispatch(addTodo(text))
          }}
          ></Header>
        <section className="main">
          <TodoList todos={todos} actions={actions}></TodoList>
        </section>
      </div>
    )
  }
}

export default connect(state=>state)(App);
