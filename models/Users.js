const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        uppercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is a required field'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is a required field'],
        minlength: [6, 'Password must be at least 6 characters']
    }
})

//fire a function before user is saved in DB
userSchema.pre('save', async function(next){
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    hashedPassword = await bcrypt.hash(this.password, salt);
    
    this.password = hashedPassword;

    next();
});

//Statics Method for User login
userSchema.statics.login =  async function(email, password) {
    const user = await this.findOne({ email });
    //console.log(user);
    if(user) {
        const auth = await bcrypt.compare(password, user.password); 

        if(auth) {
            //console.log("Returns Truthy values");
            return user;
        }else{
            console.log("\nDoes NOT return truthy values");
        }
            throw Error("invalid password");
    }
    throw Error('invalid email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;