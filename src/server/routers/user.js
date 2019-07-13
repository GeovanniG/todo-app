const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const { EXPIRE_TIME } = require('../variables/vars.js');


// Make new user, with cookie token
router.post('/user/register', async (req, res) => {
    let fields = {
        email: req.body.email,
        password: req.body.password
    };
    if (req.body.fname) fields.fname = req.body.fname; 
    if (req.body.lname) fields.lname = req.body.lname;
    
    User.create(fields)
    .then( async (user) => {
        const token = await user.generateAuthToken();
        
        if (req.body.placeTokenInCookie) {
            res.cookie('token', token, { httpOnly: true ,  expires: new Date(Date.now() + EXPIRE_TIME) });
        }
        
        res.status(201).json({ user, token });
    })
    .catch(({ name, errmsg, message }) => 
        res.status(400).json({ name, errmsg, message })
    ); 
});

// Login user in, with cookie token
router.post('/user/login', async (req, res) => {
    User.findByCredentials(req.body.email, req.body.password)
    .then(async (user) => {
        try {
            const token = await user.generateAuthToken();

            if (req.body.placeTokenInCookie) {
                res.cookie('token', token, { httpOnly: true,  expires: new Date(Date.now() + EXPIRE_TIME) });
            }

            res.json({ user, token });
        } catch (e) {
            res.status(401).json(e)
        }
    })
    .catch(e => 
        res.status(401).json(e)
    )
})

// Logout user 
router.post('/user/logout', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
        // await user.save();
        res.clearCookie('token', { httpOnly: true });
        res.json(user);
    } catch (e) {
        res.staus(400).json({ name: 'LogoutUserError', ...e });
    }
})

// Logout user from all sessions
router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        // await user.save();
        res.clearCookie('token', { httpOnly: true });
        res.json(user);
    } catch (e) {
        res.status(400).json({ name: 'LogoutAllUsersError', ...e })
    }
})

// Update user
router.patch('/user/update', auth, async (req, res) => {
    const allowedUpdates = ['fname', 'lname', 'email', 'password'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) return res.json({ name: 'UnknownPropertyError' });

    try {
        updates.map((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (e) {
        res.status(400).json({ name: "UpdateUserError", ...e});
    }
})

// Delete user
router.delete('/user/delete', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.clearCookie('token', { httpOnly: true });
        res.send(req.user);
    } catch(e) {
        res.status(400).json({ name: "DeleteUserError", ...e });
    }
})


// ONLY FOR TESTING
// Test route
router.get('/user/register', (req, res) => {
    res.send({ hello: 'world' });
})

// Get all users
router.get('/user', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(400).send({ name: 'GetAllUsersError', ...e });
    }
})

// Delete all 
router.delete('/user', async (req, res) => {
    try {
        const users = await User.deleteMany({});
        res.send(users);
    } catch (e) {
        res.status(400).send({ name: 'DeleteAllUsersError', ...e });
    }
})

module.exports = router;


// Auth Options:
// - Option 1: Use Cookies; Auth will be done automatically
// - Option 2: Once component is mounted, fetch the auth token, then place in Auth header; Auth done manually