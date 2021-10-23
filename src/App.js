import './App.css';
import Signin from './Signin';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/users">
          <div>
            <h1>Nooooooooooooooooooooo</h1>
            <Link to="/">Sign Up</Link>
          </div>
        </Route>
        <Route path="/">
          <Signin/>
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
