"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
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
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth');
    }
    else {
        next();
    }
};
// const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//     req.user ? next() : res.send("Please authenticate");
// }
module.exports = { requireAuth, isLoggedIn };
