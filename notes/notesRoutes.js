const router = require('express').Router();
const session = require('express-session')



const Note = require('./NoteSchema');

const msgNotExists = {
    message: "The id you provided does not exist"
}


router.get('/', (req, res) => {
    Note.find()
        .then(notes => {
            res.json(notes);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/note/:id', (req, res) => {
    const objId = req.params.id;
    Budget.findById(objId)
        .then(note => {
            if (note) {
                res.status(201).json({ note })
            } else {
                return res.status(404).json(msgNotExists)
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Your entry could not be retrieved", err })
        })
})

router.put('/note/:id', (req, res) => {
    Note.find()
        .select('-password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.delete('/note/:id', (req, res) => {
    const objId = req.params.id;
    Note.findByIdAndDelete(objId)
        .then(deleted => {
            if (deleted) {
                res.status(201).json({ message: "You've deleted your Entry!", objId })
            } else {
                return res.status(404).json(msgNotExists)
            }
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "There was an error, please try again later!"
            })
        })
});


router.post('/new', (req, res) => {
    const noteData = req.body;
    const note = new Note(noteData);

    if (!noteData.title) {
        return res.status(400).json({
            errorMessage: "Please provide the title for the note."
        })
    }
    note
        .save().then(note => {
            res.status(201).json(note)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error while saving the note to the database", err });
        });
})



module.exports = router;
