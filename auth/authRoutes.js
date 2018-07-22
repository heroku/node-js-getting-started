const router = require('express').Router();
const { makeToken,verifyToken }  = require('./jwt');

const session = require('express-session')
const userRoutes = require('../notepad/src/components/users/userRoutes.js');


const User = require('../notepad/src/components/users/User');

router.post('/register', (req, res) => {
  User.create(req.body) 
    // .select('-password')
    .then(({ username }) => {
      const token = makeToken(req.body);
      // we destructure the username to avoid returning the hashed password
      // then we assemble a new object and return it
      res.status(201).json({ msg: 'User Registered', username });
    })
    .catch(err => res.status(500).json(err));
});

router.put('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).json({ msg: 'Please enter a username and password' })
  }
  const { username, password } = req.body;
  User.findOne({ username })
  // .select('-password')
    .then(user => {
      user.validatePassword(password)
      .then(isMatch => {
        if (isMatch) {
          const token = makeToken(user)
          res.status(201).json({ user, token });
        } else {
          res.status(401).json({ msg: 'Password Incorrect' })
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'Error finding username', err });
      })
    })
    .catch(err => {
      res.status(500).json({ error: 'Error finding username', err });
  })
});

router.get('/', verifyToken, (req, res) => {
  User.find()
    .select('-password')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/self', verifyToken, (req, res) => {
  const { jwtpayload } = req;
  User.findById(jwtpayload.sub)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.sendStatus(500).json(err);
    });
});



module.exports = router;
