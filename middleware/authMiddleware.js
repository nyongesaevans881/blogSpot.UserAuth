const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'my super secret string', (err, decodedToken) => {
            if(err) {
                console.error(err.message);
                res.redirect('/signup&login');
            }else{
                next();
            }
        });
    }else{
        res.redirect('/signup&login')
    }
};

//Check for Current Logged in user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token,'my super secret string', async (err, decodedToken) => {
            if(err) {
                console.error(err.message);
                res.locals.user = null;
                next();
            }else{
                let user = await User.findById(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };