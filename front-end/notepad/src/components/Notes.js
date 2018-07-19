import React, { Component } from 'react';
// import logo from '../logo.svg';
import './Notes.css';
import '../components/Notes.css';
import { Container, Row, Col } from 'reactstrap';

import { getNotes } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Card, CardText, CardBody,
    CardTitle
} from 'reactstrap';

class Notes extends Component{


componentDidMount() {
    this.props.getNotes();
}

render() {
    return (
        <div>
            <h5>Your Notes:</h5>
               {this.props.notes.map(note => {
                return (
                <Card>
                <Link to={`/notes/${note.id}`} 
                className="note-card" key={note.id} note={note}>
                    <CardBody>
                            <CardTitle>{note.title.substring(0, 21)}</CardTitle>
                               <hr className="my-2" />
                            <CardText>{note.content.substring(0, 150)}</CardText>
                    </CardBody>
                </Link>
                </Card>
                )})}
            {/* <ExportCSV notes={notes} /> */}

                {this.props.pending ? <h1>LOADING</h1> : null}
        </div>
    ); 
}
}

const mapStateToProps = state => {
    return {
        notes: state.notes,
        error: state.error,
        pending: state.fetchingNotes,

    }
}

export default connect(mapStateToProps, { getNotes })(Notes);
