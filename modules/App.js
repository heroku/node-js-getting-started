import React from 'react'
import $ from 'jquery'
import Serialize from 'form-serialize'

export default React.createClass({
  getInitialState(){
    return {
      users: []
    }
  },
  getDefaultProps(){
    return {
      source: "http://tiny-tiny.herokuapp.com/collections/sat_74"
    }
  },
  componentDidMount(){

    $.get(this.props.source, (resp)=> {
      this.setState({ users: resp})
    })
  },
  handleSubmitForm(e){
    e.preventDefault();
    var serializedForm = Serialize(this.refs.userForm, {hash: true})
    $.post(this.props.source, serializedForm ,(resp)=> {
      $.get(this.props.source, (resp)=> {
        this.setState({ users: resp})
      })
    })
  },
  handleUserDelete(e){
    // get data-id of parent element
    var userId = $(e.target).parent().data("id");
    // use AJAX to "DELETE" with this id
    $.ajax({
      url: `${this.props.source}/${userId}`,
      method: "DELETE",
      dataType: "JSON",
      success: (resp)=> {
        // Get ajax again
        console.log(resp);
      }
    })
  },
  render() {
    return (
      <article>
        <h1 className="heading">Hello!</h1>
        <form method="POST" ref="userForm" action="#" onSubmit={this.handleSubmitForm}>
          <input type="text" name="username" placeholder="username"/>
          <input type="submit" value="save"/>
        </form>
        <ul>
          {this.state.users.map((user)=> {
            return <li data-id={ user._id }>{user.username}<span onClick={this.handleUserDelete}> X </span></li>
          }, this)}
        </ul>
    </article>
  )
  }
})
