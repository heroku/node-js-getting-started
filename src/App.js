import Signin from './Signin';
import Signup from './Signup';
import Navbar from './Navbar';
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";
import Chat from './Chat';




export default class App extends Component {
  render() {
    return (
      <Router>
      <Switch>
        <Route exact path="/Signup">
          <Signup/>
        </Route>
        <Route exact path="/main-page">
          <Navbar/>
          <Chat/>
        </Route>
        <Route exact path="/">
          <Signin/>
        </Route>
      </Switch>
  </Router>
    )
  }
}


// export default App;
