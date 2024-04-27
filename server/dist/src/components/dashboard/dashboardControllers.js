"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (user) => {
    jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 30 * 24 * 60 * 60
    });
};
const dashboard = (req, res) => {
    const user = req.user;
    const token = createToken(req.user);
    const formattedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        role: user.role
    };
    res.redirect(`http://localhost:5174/addPassword?user=${JSON.stringify(user)}&userToken=${token}`);
};
exports.dashboard = dashboard;
