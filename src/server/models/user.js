const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Todo = require('../models/todo');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { EXPIRE_TIME, MIN_PW_LEN } = require('../variables/vars.js');

const userSchema = new Schema({
    fname: {
        type: String,
        trim: true
    },
    lname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            return validator.isEmail(value);
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: MIN_PW_LEN
    },
    tokens: [{
        token: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now 
        }
    }]
})

userSchema.virtual('todos', {
    ref: 'Todo',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET, {
            expiresIn: EXPIRE_TIME / 1000
        });
        
        this.tokens = this.tokens.concat({token});
        await this.save();
                
        return token;
    } catch (e) {
        return Promise.reject({ name: 'TokenCreationError' });
    }
}

userSchema.methods.removeExpiredTokens = function () {
    const time = new Date().getTime();

    // Check if first one expired before going through whole array
    if ((time - this.tokens[0].createdAt.getTime()) >= EXPIRE_TIME) {
        this.tokens = this.tokens.filter(({ createdAt }) => (time - createdAt.getTime()) < EXPIRE_TIME);
    }
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return Promise.reject({ name: 'NoSuchUserError' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return Promise.reject({ name: 'LoginInError' });

    return user;
}

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 8);
        }
    } catch (e) {
        return Promise.reject({ name: 'SaveUserError'});
    }
    next();
})


userSchema.pre('remove', async function (next) {
    await Todo.deleteMany({ owner: this._id })
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;