const router = require('express').Router();
const session = require('express-session')



const Note = require('./Note');

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
    Note.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


router.post('/new', (req, res) => {
    const note = new Note(req.body);
    note.save()
        .then(user => res.status(201).json('Note Created!', note)
            .catch(err => res.status(500).send(err)))
});

router.put('/note/:id', (req, res) => {
    User.find()
        .select('-password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


module.exports = router;
