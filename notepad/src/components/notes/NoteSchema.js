const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Note = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
    },
    mind: {
        type: String,
        // required: true,
        minlength: 4,
    },
    me: {
        type: String,
        // required: true,
        minlength: 4,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastEdited: {
        type: Date,
        default: Date.now
    },
    practices : [{
        type: ObjectId,
        ref: 'practices'
    }],
    meditations: [{
        type: ObjectId,
        ref: 'meditations'
    }]

});

// noteSchema.pre('save', function preSave(next) {
//     var note = this;
//     note.lastEdited(Date.now());
//     next();
// });



module.exports = mongoose.model('Note', Note);