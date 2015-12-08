/**
 * Created by jwqin on 11/15/15.
 */
import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'

class TodoInput extends Component{
  static propTypes: {
    newTodo: PropTypes.bool,
    editing: PropTypes.bool,
    onSave: PropTypes.func,
    text: PropTypes.string
  };

  constructor(props){
    super(props);

    this.state = {
      text: props.text || ''
    }
  }

  render(){
    const {newTodo, editing, ...others} = this.props;
    return (
      <input
        type="text"
        value={this.state.text}
        className={classnames({
          'new-todo': newTodo,
          'edit': editing
        })}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange.bind(this)}
        onKeyDown={this.handleSubmit.bind(this)}
        {...others}
        />
    )
  }

  handleSubmit(e) {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleBlur(e) {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  }
}
export default TodoInput
