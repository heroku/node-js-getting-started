import axios from 'axios';
export const PENDING = 'PENDING';
export const ERROR = 'ERROR';
export const SUCCESS_NOTE = 'SUCCESS_NOTE';
export const SUCCESS_NOTES = 'SUCCESS_NOTES';
export const UPDATING = "UPDATING";
export const SUCCESS_USER = "SUCCESS_USER";


export const getNotes = () => {
    return (dispatch) => {
        dispatch({ type: PENDING });
        axios
            .get(`http://localhost:5000/users/notes`)
            .then(response => {
                dispatch({ type: SUCCESS_NOTES, notes: response.data })
            })
            .catch(err => {
                dispatch({ type: ERROR, error: 'ERROR FETCHING NOTES' })
            })
    }
 }

export const getNote = (id) => {
    return (dispatch) => {
        dispatch({ type: PENDING });
        axios
            .get(`http://localhost:5000/users/notes/note/${id}`)
            .then(response => {
                console.log('RES', response)
                dispatch({ type: SUCCESS_NOTE, note: response.data })
            })
            .catch(err => {
                dispatch({ type: ERROR, error: 'ERROR FETCHING NOTE' })
            })
    }
}

export const startEditing = note => {
    return {
        type: UPDATING,
        note
    };
};

export const editNote = (note) => {
    return (dispatch) => {
        dispatch({ type: PENDING });
        axios
            .put(`http://localhost:5000/users/notes/note/${note.id}`, note)
            .then(response => {
                console.log('RES', response)
                dispatch({ type: SUCCESS_NOTE, note: response.data })
            })
            .catch(err => {
                dispatch({ type: ERROR, error: 'ERROR FETCHING NOTE' })
            })
    }
};

export const createNote = (note) => {
    return dispatch => {
        dispatch({ type: PENDING });
        console.log(note);
        axios
            .post(`http://localhost:5000/users/notes/new`, note)
            .then(response => {
                dispatch({ type: SUCCESS_NOTES, notes: response.data })
            })
            .catch(() => {
                dispatch({ type: ERROR, error: 'ERROR CREATING NOTE' })
            })
    }
}

export const deleteNote = id => {
    return dispatch => {
        dispatch({ type: PENDING });
        axios
            .delete(`http://localhost:5000/users/notes/${id}`)
            .then(response => {
                dispatch({ type: SUCCESS_NOTES, notes: response.data })
            })
            .catch(err =>
                dispatch({ type: ERROR, error: 'ERROR DELETING NOTE' })
            );
    }
}

export const createUser = (user) => {
    return dispatch => {
        dispatch({ type: PENDING });
        console.log(user);
        axios
            .post(`http://localhost:5000/users/auth/register`, user)
            .then(response => {
                dispatch({ type: SUCCESS_USER, users: response.data })
            })
            .catch(() => {
                dispatch({ type: ERROR, error: 'ERROR CREATING USER' })
            })
    }
}

export const loginUser = (user) => {
    return dispatch => {
        dispatch({ type: PENDING });
        console.log(user);
        axios
            .put(`http://localhost:5000/users/auth/login`, user)
            .then(response => {
                dispatch({ type: SUCCESS_USER, user: response.data })
            })
            .catch(() => {
                dispatch({ type: ERROR, error: 'ERROR LOGGIN IN!' })
            })
    }
}
