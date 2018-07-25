const jwt = require('jsonwebtoken');
const SECRET = 'THIS SHOULD BE IN AN ENV VAR';


const makeToken = (user) => {
    const timestamp = new Date().getTime();
    const payload = {
        sub: user._id,
        name: user.username,
        iat: timestamp,
        loggedIn: true
    }

    const options = {
        expiresIn: '24h',
    }
    return jwt.sign(payload, SECRET, options)

}

const verifyToken = (req, res, next)  => {
//get auth header
///make sure it exists
//if doesnt, send error.

const token = req.headers.authorization;
if(token === undefined){
    res.sendStatus(401);
    return;
}
///if it does decodes

jwt.verify(token, SECRET, (err, payload)  => {
//make sure it decodes
    if(err){
        res.sendStatus(401);
        return;
    }
    //pass decoded payoud on the req

    req.jwtpayload = payload
    next();
})

}

module.exports =  {makeToken, verifyToken}
