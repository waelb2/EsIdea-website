"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = exports.requireAuth = void 0;
const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'esideaisthegoat', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/auth');
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect('/auth');
    }
};
exports.requireAuth = requireAuth;
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth');
    }
    else {
        next();
    }
};
exports.isLoggedIn = isLoggedIn;
module.exports = { requireAuth: exports.requireAuth, isLoggedIn: exports.isLoggedIn };
