import React, { Component } from 'react';
import { Col, Button, Row, Container } from 'reactstrap';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import './Home.css'
// https://reacttraining.com/react-router/web/example/auth-workflow

class Home extends Component {


    render() {
        return (
            <Container>
                <div>
                    <Link to='/users/auth/register'>
                        <Col md="9" className={"home-button"}>
                            <button className={"button"} onClick={this.handleSubmit}>Register</button>
                        </Col>
                    </Link>
                    </div>
                    <div>
                <Link to='/users/auth/login'>
                        <Col md="9" className={"home-button"}>
                        <button className={"button"} onClick={this.handleSubmit}>Login</button>
                    </Col>
                </Link>
                </div>
        </Container>
        );
    }
}

export default Home;
