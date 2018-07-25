const router = require('express').Router();
const { makeToken, verifyToken }  = require('./jwt');

const session = require('express-session')
const userRoutes = require('../users/userRoutes');


const User = require('../users/User');

// router
//   .route('/login')
//   .post(post);


router.post('/register', (req, res) => {
  User.create(req.body) 
    // .select('-password')
  // const user = new User(req.body);
  // user.save()
    .then(({ username }) => {
      const token = makeToken(req.body);
      // we destructure the username to avoid returning the hashed password
      // then we assemble a new object and return it
      res.status(201).json({ msg: 'User Registered', username });
    })
    .catch(err => res.status(500).json(err));
});

router.put('/login', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).json({ msg: 'Please enter a username and password' })
  }
  const { username, password } = req.body;
  User.findOne({ username })
  // .select('-password')
    .then(async user => {
      const response = await user.validatePassword(password)
      if(response) {
        const token = makeToken(user)
        res.status(200).json( { ...user.toObject(), token });
      } else {
        res.status(401).json({ msg: "Password does not match!"})
      }
    })
    .catch(err => {
      // console.log(token)
      res.status(500).json({ error: err.message });
  })
});

  // function post (req, res) {
  //   const { username, password } = req.body;
  //   User.findOne({ username }, (err, user) => {
  //     if (err) {
  //       res.status(403).json({ error: 'Invalid Username/Password' });
  //       return;
  //     }
  //     if (user === null) {
  //       res.status(422).json({ error: 'No user with that username in our DB' });
  //       return;
  //     }
  //     user.validatePassword(password, (err, isMatch) => {
  //       if (err) {
  //         res.status(500).json({ error: 'server error' });
  //       }
  //       if (!isMatch) {
  //         res.status(422).json({ error: 'passwords dont match' });
  //         return;
  //       }
  //       const payload = {
  //         username: user.username
  //       }; // what will determine our payload.
  //       const token = jwt.sign(payload, mysecret); // creates our JWT with a secret and a payload and a hash.
  //       res.status(200).json({ token, msg: 'Logged In' })// sends the token back to the client
  //     })
  //   });

  // };


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
