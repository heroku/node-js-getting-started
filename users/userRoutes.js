const router = require('express').Router();
const session = require('express-session')



const User = require('./User');

router.get('/', (req, res) => {
    User.find()
        .select('-password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


router.post('/new', (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(user => res.status(201).json('User Registered!')
        .catch(err => res.status(500).send(err)))
});




// router.get('/${user.id}/notes/note/${id}', (req, res) => {

//         .then(user => res.status(201).json('')
//         .catch(err => res.status(500).send(err)))
// });


// router.put('${user.id}/notes/note/${note.id}', (req, res) => {

// });






module.exports = router;
