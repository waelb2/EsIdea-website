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
exports.updatePassword = exports.addPassword = exports.logout = exports.authenticateCallback = exports.authenticate = exports.auth = exports.login_post = exports.login_get = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const userModels_1 = require("../user/userModels");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
};
exports.auth = auth;
//////////////////////////////// google auth //////////////////////////////////////
const authenticate = passport_1.default.authenticate('google', { scope: ['email profile'], prompt: 'select_account' });
exports.authenticate = authenticate;
const authenticateCallback = passport_1.default.authenticate('google');
exports.authenticateCallback = authenticateCallback;
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
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, 'net ninja secret', {
        expiresIn: 30 * 24 * 60 * 60,
    });
};
const login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // no validation !
        if (!user) {
            return res.status(200).json({ message: "No user found with that email!" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(String(password), String(user.password));
        if (!passwordMatch) {
            return res.status(404).json({ message: "Wrong Password, try again!" });
        }
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ user });
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
});
exports.login_post = login_post;
//////////////////////////////////////////////////////////////////////////
const addPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const salt = yield bcrypt_1.default.genSalt();
    const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt);
    try {
        const updateResult = yield userModels_1.User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
        if (!updateResult) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Password Added Successfully" });
    }
    catch (e) {
        const errors = handleError(e);
        return res.status(404).json({ errors });
    }
});
exports.addPassword = addPassword;
//////////////////////////////////////////////////////////////////////////
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword } = req.body;
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // no validation !
        if (!user) {
            return res.status(400).json({ message: "No user found with that email!" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(currentPassword, String(user.password));
        if (!passwordMatch) {
            return res.status(404).json({ message: "Wrong Password, try again!" });
        }
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt);
        const updateResult = yield userModels_1.User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
        if (!updateResult) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Password Added Successfully" });
    }
    catch (e) {
        const errors = handleError(e);
        return res.status(404).json({ errors });
    }
});
exports.updatePassword = updatePassword;
//////////////////////////////////////////////////////////////////////////
const handleError = (err) => {
    let errors = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors;
};
