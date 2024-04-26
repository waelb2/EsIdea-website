"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = exports.role = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
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
exports.isAuthenticated = isAuthenticated;
const role = (req, res, next) => {
};
exports.role = role;
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth');
    }
    else {
        next();
    }
};
exports.isLoggedIn = isLoggedIn;
