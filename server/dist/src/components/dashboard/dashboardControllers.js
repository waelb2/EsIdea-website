"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Create JWT token for user authentication.
 * @param user - UserInterface object.
 * @returns JWT token.
 */
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 30 * 24 * 60 * 60 // Expires in 30 days
    });
};
/**
 * Redirect to the dashboard with user information and token.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const dashboard = (req, res) => {
    const user = req.user;
    const token = createToken(req.user);
    const formattedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        role: user.role,
        passwordIsSet: user.password ? true : false
    };
    // Redirect to addPassword route with user information and token
    res.redirect(process.env.CLIENT_URL +
        `/addPassword?user=${JSON.stringify(formattedUser)}&userToken=${token}`);
};
exports.dashboard = dashboard;
