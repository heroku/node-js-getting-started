import React, { Component } from 'react';
import { deleteNote, getNote, startEditing } from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import DeleteModal from './Modal';
import "./Note.css";
import Export from './ToPDF';


class Note extends Component {
    constructor(props){
        super(props);
        this.state = {
            note: {},
            modal: false
        }

    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getNote(id);
    }
     editNote = () => {
         this.props.startEditing(this.props.note);
         this.props.history.push(`/notes/edit/${this.props.note.id}`)
    }
    deleteNote = () => {
        this.props.deleteNote(this.props.note.id);
        this.props.history.push(`/notes/`)
    }

    handleprintDocument = () => {
        this.props.printDocument(this.props.note)
    }

render(){
    const { note } = this.state;
    const props = {
        note: this.state
    }
    return (
        <div key={this.props.note.id}>
            <div className={"textLink"}> 
                <Link 
                    to={`/notes/edit/${this.props.note.id}`}
                    onClick={this.editNote} >
                    <a>edit</a>
                </Link>
                <Link to={`/notes/delete/`}>
                <DeleteModal  show={this.props.modal}
                    onClose={this.toggle} 
                    deleteNote={this.deleteNote} 
                    {...props} 
                />
            </Link>
                {/* <Export key={this.props.note.id} {...props} handleprintDocument={this.printDocument} id="divToPrint"/> */}
            </div> 
            <div> 
                <div className={"note-title"}>
                    <p>{this.props.note.title}</p>
                </div>
            </div> 
            <div> 
                <div className={"note-content"}>
                <p>{this.props.note.content}</p>
            </div>

            </div> 
        </div>
    );
}
 
}

const mapStateToProps = state => {
    return {
        note: state.note,
        error: state.error,
        pending: state.fetchingNotes,

    }
}

export default connect(mapStateToProps, { getNote, deleteNote, startEditing })(Note);

