const mongoose = require('mongoose');

const Note = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
    },
    body: {
        type: String,
        required: true,
        minlength: 4,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastEdited: {
        type: Date,
        default: Date.now
    }
});

noteSchema.pre('save', function preSave(next) {
    var note = this;
    note.lastEdited(Date.now());
    next();
});



module.exports = mongoose.model('Note', Note);