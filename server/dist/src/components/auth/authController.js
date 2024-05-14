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
const bcrypt_1 = __importDefault(require("bcrypt")); // Importing bcrypt for password hashing
const passport_1 = __importDefault(require("passport")); // Importing passport for authentication
const userModels_1 = require("../user/userModels"); // Importing User model
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Importing jsonwebtoken for token generation
const nodemailer_1 = require("../../config/nodemailer"); // Importing function for sending emails
const crypto_1 = __importDefault(require("crypto")); // Importing crypto for token hashing
// Default route handler for authentication
const auth = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>'); // Sending HTML link for Google authentication
};
exports.auth = auth;
// Passport middleware for Google authentication
const authenticate = passport_1.default.authenticate('google', {
    scope: ['email profile'],
    prompt: 'select_account'
});
exports.authenticate = authenticate;
// Passport middleware for handling Google authentication callback
const authenticateCallback = passport_1.default.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/failure'
});
exports.authenticateCallback = authenticateCallback;
// Failure route handler for Google authentication
const failure = (req, res) => {
    res.status(403).json({
        error: 'You must be an Esi member'
    });
};
exports.failure = failure;
// Route handler for logging out
const logout = (req, res) => {
    req.logout(() => { }); // Logging out the user
    res.redirect(process.env.CLIENT_URL + '/login'); // Redirecting to login page
};
exports.logout = logout;
// Route handler for rendering login page
const login_get = (req, res) => {
    res.send('login_get'); // Sending message indicating rendering login page
};
exports.login_get = login_get;
// Function to create JWT token for user
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 30 * 24 * 60 * 60 // Token expires in 30 days
    });
};
// Route handler for user login
const login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body; // Extracting email and password from request body
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // Finding user by email
        if (!user) {
            return res.status(400).json({ message: 'No user found with that email' }); // Sending error if user not found
        }
        const passwordMatch = yield bcrypt_1.default.compare(String(password), String(user.password)); // Comparing passwords
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong Password, try again' }); // Sending error if password is wrong
        }
        const token = createToken(user); // Creating token
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000 // Setting cookie expiry time
        });
        // Formatting user object
        const formattedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            role: user.role
        };
        // Sending user and token in response
        return res.status(200).json({ user: formattedUser, userToken: token });
    }
    catch (err) {
        const errors = handleError(err); // Handling errors
        res.status(500).json({ errors });
    }
});
exports.login_post = login_post;
// Function to add password to user profile
const addPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body; // Extracting email and new password
    const salt = yield bcrypt_1.default.genSalt(); // Generating salt
    const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt); // Hashing password
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // Finding user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Sending error if user not found
        }
        user.password = hashedPassword; // Updating user's password
        user.save(); // Saving user
        // Formatting user object
        const formattedUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            role: user.role
        };
        const token = createToken(user); // Creating token
        // Sending success response
        return res
            .status(200)
            .json({ message: 'Password Added Successfully', formattedUser, userToken: token });
    }
    catch (e) {
        const errors = handleError(e); // Handling errors
        return res.status(500).json({ errors });
    }
});
exports.addPassword = addPassword;
// Function to update user's password
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword, confirmNewPassword } = req.body; // Extracting request body data
    try {
        const user = yield userModels_1.User.findOne({ email: email }); // Finding user by email
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email!' }); // Sending error if user not found
        }
        const passwordMatch = yield bcrypt_1.default.compare(currentPassword, String(user.password)); // Comparing passwords
        if (!passwordMatch) {
            return res.status(404).json({ message: 'Wrong Password, try again!' }); // Sending error if password is wrong
        }
        const salt = yield bcrypt_1.default.genSalt(); // Generating salt
        const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt); // Hashing password
        // Updating user's password
        const updateResult = yield userModels_1.User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
        if (!updateResult) {
            return (res
                .status(404)
                .json({ message: 'Failed to update password, try again!' })); // Sending error if update fails
        }
        return res.status(200).json({ message: 'Password Added Successfully' }); // Sending success response
    }
    catch (e) {
        const errors = handleError(e); // Handling errors
        return res.status(400).json({ errors });
    }
});
exports.updatePassword = updatePassword;
// Function to send password reset email
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email; // Extracting email from request body
    const user = yield userModels_1.User.findOne({ email: email }); // Finding user by email
    if (!user) {
        return res.status(404).json({ message: 'User not found' }); // Sending error if user not found
    }
    const resetToken = user.createResetPasswordToken(); // Creating password reset token
    yield user.save(); // Saving user
    const resetUrl = process.env.CLIENT_URL + `/auth/resetPassword/${resetToken}`; // Generating reset URL
    const message = `Please use the link below to reset your password:\n ${resetUrl}\nThis link is valid only for 10 minutes.`; // Email message
    try {
        yield (0, nodemailer_1.sendEmail)({
            email: user.email,
            subject: 'Esidea',
            message: message
        });
        return res
            .status(200)
            .json({ message: 'Password reset email was sent to you' }); // Sending success response
    }
    catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        user.save();
        return res.status(500).json({
            message: 'There was an error sending passord reset email. Try again later!'
        }); // Sending error if email sending fails
    }
});
exports.forgetPassword = forgetPassword;
// Function to reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, confirmNewPassword } = req.body; // Extracting request body data
    const token = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex'); // Generating token hash
    const user = yield userModels_1.User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpires: { $gt: Date.now() }
    }); // Finding user by token
    if (!user) {
        return res.status(400).json({ message: 'Token is invalid or has expired!' }); // Sending error if token is invalid or expired
    }
    if (!newPassword == confirmNewPassword) {
        return res.status(400).json({ message: 'Error, try again!' }); // Sending error if passwords don't match
    }
    const salt = yield bcrypt_1.default.genSalt(); // Generating salt
    const hashedPassword = yield bcrypt_1.default.hash(String(newPassword), salt); // Hashing password
    // Updating user's password
    const updateResult = yield userModels_1.User.findOneAndUpdate({ passwordResetToken: token }, { $set: { password: hashedPassword } }, { runValidators: true, new: true });
    if (!updateResult) {
        return res.status(404).json({ message: 'User not found' }); // Sending error if user not found
    }
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save(); // Saving user
    const jwt = createToken(user); // Creating token
    res.cookie('token', jwt, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // Setting token cookie
    return res.status(200).json({ user }); // Sending success response
});
exports.resetPassword = resetPassword;
// Function to handle errors
const handleError = (err) => {
    let errors = {};
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach((validationError) => {
            errors[validationError.path] = validationError.message;
        });
    }
    return errors; // Returning errors
};
