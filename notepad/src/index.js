import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import Home from './components/Home';
import App from './App';

import homeRoute from './homeRoute';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import history from './history'

import noteReducer from './reducers';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(noteReducer, applyMiddleware(logger, thunk));

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>

    </Router>,

    document.getElementById('root')
);
