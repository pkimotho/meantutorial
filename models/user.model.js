const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;

// Email Validation Functions

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else if (email.length < 5 || email.length > 30) {
        return false;
    } else {
        return true;
    }
};
let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        return regExp.test(email);
    }
};

// Username Validation Functions

let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else if (username.length < 3 || username.length > 15) {
        return false
    } else {
        return true;
    }
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z\-]+$/);
        return regExp.test(username);
    }
};

// Password Validation Functions

let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else if (password.length < 8 || password.length > 35) {
        return false
    } else {
        return true;
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        // Should contain at least one digit
        // Should contain at least one lower case
        // Should contain at least 8 from the mentioned characters
        // Should contain at least one upper case
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};
// Email Validators Array

const emailValidators = [{
        validator: emailLengthChecker,
        message: 'Email must be at least 5 characters and no more than 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid email'
    }
];

// Username Validators Array

const usernameValidators = [{
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters and no more than 15'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
];

// Password Validators Array

const passwordValidators = [{
        validator: passwordLengthChecker,
        message: 'Password must be atleast 8 characters and no more than 35'
    },
    {
        validator: validPassword,
        message: 'Password must have at least one lowercase, uppercase, special character and number'
    }
];

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: usernameValidators
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: emailValidators
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidators
    }
});
userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    } else {
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    }
});
userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);