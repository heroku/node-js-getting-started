import React, { Component } from 'react';
import { editNote, getNote } from '../actions';
import { connect } from 'react-redux';
import { Col, Button, Form, FormGroup, Input } from 'reactstrap';


class NoteEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: this.props.note.id,
            title: props.note.title,
            content: props.note.content
        };

    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getNote(id);
    }
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

saveNote = e => {
    console.log("SAVING", this.state);
    this.props.editNote(this.state);
    this.props.history.push(`/notes/`)
}


    render(){
        return (
            < div key={this.props.note.id} className={'noteform'} >
                <div>
                    <h5>Edit Note:</h5>
                    <Form>
                        <FormGroup >
                            <div>
                                <Input 
                                    defaultValue={this.state.title}
                                    type="text"
                                    name="title"
                                    // id="title"
                                    onChange={this.handleChange}
                                    // value={this.state.title}
                                    placeholder="Title"
                                    // ref={(input) => this.input = input}

                                />
                            </div>
                        </FormGroup>
                        <FormGroup >
                            <div>
                                <Input rows="15"
                                    type="textarea"
                                    placeholder="Your Dreams Continue Here"
                                    onChange={this.handleChange}
                                    value={this.state.content}
                                    name="content"
                                    id="content"

                                    // placeholder={this.props.location.state.content}
                                />
                            </div>
                        </FormGroup>
                        <FormGroup >
                            <div >
                                <Button color="info" onClick={this.saveNote}>Update</Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div >


            // //     <div className={'note'}>
            // //         <input>{this.props.note.title}</input>
            // //         <p>{this.props.note.content}</p>

            // </div >

        );
    }    
}

// updatingNote: false,


const mapStateToProps = state => {
    return {
        note: state.note
    };
};
export default connect(mapStateToProps, { editNote, getNote })(NoteEdit);
