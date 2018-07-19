import { PENDING, ERROR, SUCCESS_NOTES, SUCCESS_NOTE, UPDATING } from '../actions';

const initialState = {
    notes: [],
    fetchingNotes: false,
    addingNote: false,
    updatingNote: false,
    deletingNote: false,
    error: null,
    note: {
        modal: false,

    }
}

const noteReducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING:
            return Object.assign({}, state, { fetchingNotes: true });
        case SUCCESS_NOTES:
            return Object.assign({}, state, {
                notes: action.notes,
                fetchingNotes: false
            });
        case SUCCESS_NOTE:
            return Object.assign({}, state, {
                note: action.note,
                fetchingNotes: false
            });
        case ERROR:
            return Object.assign({}, state, {
                error: action.error,
                fetchingNotes: false
            });
        case UPDATING:
            return Object.assign({}, state, {
                updating: true,
                note: action.note
            });
        default:
            return state;
    }

}

export default noteReducer;