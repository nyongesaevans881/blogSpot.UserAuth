const User = require('../models/Users');
const jwt = require('jsonwebtoken')


//errorHandlers
const errorHandler = (err) => {
    console.log(`\nError Message: ${err.message},\nError Code: ${err.code}\n`);
    let errors = { email: '', password: '' };

    //Incorrect credentials on login Error handler
    if(err.message === 'invalid email'){
        errors.email = 'Bruuh..!! That email is not registered.';
    }
    if(err.message === 'invalid password'){
        errors.password = 'Bruuh..!! That is not your password.';
    }


    //Duplicate Key errors
    if(err.code === 11000) {
        errors.email = 'There already exists a user with given email.'
    }

    //Validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({ properties })=> {
            errors[properties.path] = properties.message;
            console.log(errors)
        });
    }

    return errors;
};

//Create JWT tokens
const maxAge = 24 * 60 * 60 * 3;
const createToken = (id) => {
    return jwt.sign({ id }, 'my super secret string', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup&login');
}


module.exports.login_get = (req, res) => {
    res.render('signup&login');
}



module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);

    try{
        const user = await User.create( { name, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = errorHandler(err);
        res.status(400).json({ errors })
    };
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try{
    const user = await User.login( email, password );
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id })
    }
    catch(err){
        const errors = errorHandler(err);
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};