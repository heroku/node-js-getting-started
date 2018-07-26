import React from 'react'
import { Switch, Route } from 'react-router-dom'
// import { IndexRoute } from 'react-router'

import Notes from './Notes'
import NewNote from './NewNote'
import Note from './Note'
import NoteEdit from './NoteEdit'
import Modal from './Modal'
import './Main.css'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import App from '../App'






// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
        <Switch>

            <Route exact path='/users/notes' component={Notes} />
            <Route path='/users/notes/new' component={NewNote} />
            <Route exact path='/users/notes/note/:id' component={Note} />
            <Route path='/users/notes/note/edit/:id' component={NoteEdit} />
            <Route exact path='/users/notes/notes/delete/' component={Modal} />
            <Route path='/users/auth/register' component={Register} />
            <Route path='/users/auth/login' component={Login} />
        </Switch>
        

);

export default Main;
