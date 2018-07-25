import React, { Component } from 'react';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Input } from 'reactstrap';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: '',
            Password: ''
        }
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        this.props.loginUser(this.state);
        this.setState({
            Username: '',
            Password: ''
        });
        this.props.history.push(`/notes/`)
    }

    render() {
        return (
            <div>
                <h5>Sign In:</h5>
                <Form>
                    <FormGroup>
                        <div>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={this.state.username}
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <div>
                            <Input
                                type="text"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={this.state.password}
                                name="password"
                            />
                        </div>
                    </FormGroup>
                    <FormGroup >
                        <div>
                            <Button color="info" onClick={this.handleSubmit}>Sign in</Button>
                        </div>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}



export default connect(null, { loginUser })(Login);