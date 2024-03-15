"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.isLoggedIn = exports.authenticateCallback = exports.authenticate = exports.auth = exports.login_post = exports.login_get = void 0;
const passport_1 = __importDefault(require("passport"));
const auth = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
};
exports.auth = auth;
//////////////////////////////// google auth //////////////////////////////////////
const authenticate = passport_1.default.authenticate('google', { scope: ['email profile'], prompt: 'select_account' });
exports.authenticate = authenticate;
const authenticateCallback = passport_1.default.authenticate('google');
exports.authenticateCallback = authenticateCallback;
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.send("Please authenticate");
};
exports.isLoggedIn = isLoggedIn;
const logout = (req, res) => {
    req.logout(() => { });
    res.redirect('/auth');
};
exports.logout = logout;
//////////////////////////////// google auth //////////////////////////////////////
const login_get = (req, res) => {
    res.send("login_get");
};
exports.login_get = login_get;
const login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        res.status(200).json();
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
});
exports.login_post = login_post;
const handleError = (err) => {
    let errors = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors;
};
