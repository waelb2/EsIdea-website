"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = exports.profile = void 0;
const profile = (req, res) => {
    res.send(req.user);
};
exports.profile = profile;
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth');
    }
    else {
        next();
    }
};
exports.isLoggedIn = isLoggedIn;
