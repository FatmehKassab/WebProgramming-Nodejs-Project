const express = require('express');
const session = require('express-session');

const middleware = express();


middleware.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60*60*1000, // 60 minutes in milliseconds
    }
}));

// Middleware to check if the user is authenticated
middleware.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else return res.redirect('/login');
};

module.exports = middleware;
