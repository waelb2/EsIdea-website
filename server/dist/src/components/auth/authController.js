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
exports.resetPassword = exports.forgetPassword = exports.updatePassword = exports.addPassword = exports.failure = exports.logout = exports.authenticateCallback = exports.authenticate = exports.auth = exports.login_post = exports.login_get = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const userModels_1 = require("../user/userModels");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("../../config/nodemailer");
const crypto_1 = __importDefault(require("crypto"));
const auth = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
};
exports.auth = auth;
//////////////////////////////// google auth //////////////////////////////////////
const authenticate = passport_1.default.authenticate('google', {
    scope: ['email profile'],
    prompt: 'select_account'
});
exports.authenticate = authenticate;
const authenticateCallback = passport_1.default.authenticate('google', {
    // successRedirect: 'http://localhost:5174/addPassword',
    successRedirect: '/dashboard',
    failureRedirect: '/auth/failure'
});
exports.authenticateCallback = authenticateCallback;
const failure = (req, res) => {
    res.status(403).json({
        error: 'You must be an Esi member'
    });
};
exports.failure = failure;
const logout = (req, res) => {
    req.logout(() => { });
    res.redirect(process.env.CLIENT_URL + '/login');
};
exports.logout = logout;
//////////////////////////////// google auth //////////////////////////////////////
const login_get = (req, res) => {
    res.send('login_get');
};
exports.login_get = login_get;
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 30 * 24 * 60 * 60
    });
};
const login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // no validation !
        if (!user) {
            return res.status(400).json({ message: 'No user found with that email' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(String(password), String(user.password));
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong Password, try again' });
        }
        const token = createToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        const formattedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            role: user.role
        };
        return res.status(200).json({ user: formattedUser, userToken: token });
    }
    catch (err) {
        const errors = handleError(err);
        res.status(500).json({ errors });
    }
});
exports.login_post = login_post;
//////////////////////////////////////////////////////////////////////////
const addPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const salt = yield bcrypt_1.default.genSalt();
    const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt);
    try {
        const user = yield userModels_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = hashedPassword;
        user.save();
        const formattedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            role: user.role
        };
        const token = createToken(user);
        return res
            .status(200)
            .json({ message: 'Password Added Successfully', formattedUser, userToken: token });
    }
    catch (e) {
        const errors = handleError(e);
        return res.status(500).json({ errors });
    }
});
exports.addPassword = addPassword;
//////////////////////////////////////////////////////////////////////////
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // no validation !
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email!' });
        }
        const passwordMatch = yield bcrypt_1.default.compare(currentPassword, String(user.password));
        if (!passwordMatch) {
            return res.status(404).json({ message: 'Wrong Password, try again!' });
        }
        // if (newPassword != confirmNewPassword){
        //     return res.status(404).json({ message: "Please confirm your new password!" });
        // }
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt);
        const updateResult = yield userModels_1.User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
        if (!updateResult) {
            return (res
                .status(404)
                .json({ message: 'Failed to update password, try again!' }));
        }
        return res.status(200).json({ message: 'Password Added Successfully' });
    }
    catch (e) {
        const errors = handleError(e);
        return res.status(400).json({ errors });
    }
});
exports.updatePassword = updatePassword;
//////////////////////////////////////////////////////////////////////////
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield userModels_1.User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = user.createResetPasswordToken();
    yield user.save();
    //const resetUrl = `${req.protocol}://${req.get("host")}/auth/resetPassword/${resetToken}`;
    const resetUrl = process.env.CLIENT_URL + `/auth/resetPassword/${resetToken}`;
    const message = `Please use the link below to reset your password:\n ${resetUrl}\nThis link is valid only for 10 minutes.`;
    try {
        yield (0, nodemailer_1.sendEmail)({
            email: user.email,
            subject: 'Esidea',
            message: message
        });
        return res
            .status(200)
            .json({ message: 'Password reset email was sent to you' });
    }
    catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save();
        return res.status(500).json({
            message: 'There was an error sending passord reset email. Try again later!'
        });
    }
});
exports.forgetPassword = forgetPassword;
///////////////////////////////////////////////////////////////////////////
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, confirmNewPassword } = req.body;
    const token = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield userModels_1.User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpires: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired!' });
    }
    if (!newPassword == confirmNewPassword) {
        return res.status(400).json({ message: 'Error, try again!' });
    }
    const salt = yield bcrypt_1.default.genSalt();
    const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt);
    const updateResult = yield userModels_1.User.findOneAndUpdate({ passwordResetToken: token }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
    if (!updateResult) {
        return res.status(404).json({ message: 'User not found' });
    }
    console.log('done3');
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save();
    const jwt = createToken(user);
    res.cookie('token', jwt, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    return res.status(200).json({ user });
});
exports.resetPassword = resetPassword;
const handleError = (err) => {
    let errors = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors;
};
