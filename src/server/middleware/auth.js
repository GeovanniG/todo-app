const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ name: 'MissingTokenError'});
        }

        const decoded = await jwt.verify(token, process.env.SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            return res.status(401).json({ name: 'NoSuchUserError' });
        }

        user.removeExpiredTokens();

        // Check for correct user
        if (req.params.id && req.params.id !== String(user._id)) {
            console.log(req.params.id, String(user._id))
            return res.status(401).send({ name: "UserValidationError" });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).json({ name: 'AuthError' });
    }
}

module.exports = auth;