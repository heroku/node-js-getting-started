import Signin from './Signin';
import Signup from './Signup';
import Navbar from './Navbar';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/Signup">
          <Signup/>
        </Route>
        <Route exact path="/main-page">
          <Navbar/>
        </Route>
        <Route exact path="/">
          <Signin/>
        </Route>
      </Switch>
  </Router>
  );
}

export default App;
