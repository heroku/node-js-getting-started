import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './components/Home'



const homeRoute = (
    <Switch>
        <Route exact path='/home' component={Home} />
    </Switch>
);

export default homeRoute;
