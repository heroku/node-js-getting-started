const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const app = express();

let nextId = 6;

const dummyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

let notes = [
    {
        id: 1,
        title: 'Raps',
        subcontent: 'lyrics to a song',
        content: dummyText
    },
    {
        id: 2,
        title: 'Affirmation',
        subcontent: 'Daily Affirmantion: I am going to win ',
        content: 'A ka dua, Tuf ur biu, Bi aa chefu, Sude ner af, an nuteru.'
    },
    {
        id: 3,
        title: 'Stevie owes me 2 BTC',
        content: dummyText
    },
    {
        id: 4,
        title: 'Poems',
        content: dummyText
    },
    {
        id: 5,
        title: 'The Place to Be',
        subcontent: 'this ish the place to be',
        content: 'lyrics to a song Some quick example text to build on the card title and make up the bulk of the card'
    }
];

app.use(bodyParser.json());

app.use(cors());

app.get('/notes', (req, res) => {
    setTimeout(() => {
        res.send(notes);
    }, 1000);
});

app.get('/notes/:id', (req, res) => {
    const note = notes.filter(n => n.id.toString() == req.params.id)[0];

    if (note) {
        res.status(200).json(note);
    } else {
        res.status(404).send({ msg: 'Note not found' });
    }
});

app.post('/notes', (req, res) => {
    const note = { id: getNextId(), ...req.body };

    notes = [...notes, note];

    res.send(notes);
});

app.put('/notes/:id', (req, res) => {
    const { id } = req.params;

    const noteIndex = notes.findIndex(n => n.id == id);

    if (noteIndex > -1) {
        const note = { ...notes[noteIndex], ...req.body };

        notes = [
            ...notes.slice(0, noteIndex),
            note,
            ...notes.slice(noteIndex + 1),
        ];
        res.send(notes);
    } else {
        res.status(404).send({ msg: 'Note not found' });
    }
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    notes = notes.filter(f => f.id !== Number(id));

    res.send(notes);
});

function getNextId() {
    return nextId++;
}

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
