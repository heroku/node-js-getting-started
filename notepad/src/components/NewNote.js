import React, { Component } from 'react';
import { createNote } from '../actions';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Input } from 'reactstrap';
import './NewNote.css';

class NewNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: ''
        }
    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        this.props.createNote(this.state);
        this.setState({
            title: '',
            content: ''        
        });
        this.props.history.push(`/notes/`)
    }

    render() {
        return (
            <div>
            <h5>Create New Note:</h5>
            <Form>
                <FormGroup>
                    <div>
                        <Input 
                            type="text" 
                            name="title" 
                            placeholder="Title"
                            onChange={this.handleChange}
                            value={this.state.title} 
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <div>
                        <Input rows="15"
                            type="textarea"
                            placeholder="Your Dreams Begin Here"
                            onChange={this.handleChange}
                            value={this.state.content}
                            name="content" 
                        />
                    </div>
                </FormGroup>
                <FormGroup >
                        <div>
                        <Button color="info"onClick={this.handleSubmit}>Save</Button>
                    </div>
                </FormGroup>
                </Form>
            </div>
        )
    }
}



export default connect(null, { createNote })(NewNote);