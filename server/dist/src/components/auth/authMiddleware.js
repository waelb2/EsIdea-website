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
exports.authMiddleWare = exports.isLoggedIn = exports.role = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Importing jwt and JwtPayload types from jsonwebtoken
const dotenv_1 = __importDefault(require("dotenv")); // Importing dotenv for environment variables
dotenv_1.default.config(); // Configuring dotenv to read environment variables
// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt; // Getting JWT token from cookies
    // Check if token exists
    if (token) {
        // Verify the token
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message); // Log error message
                res.redirect('/auth'); // Redirect to authentication page if token verification fails
            }
            else {
                console.log(decodedToken); // Log decoded token
                next(); // Move to the next middleware if token is verified
            }
        });
    }
    else {
        res.redirect('/auth'); // Redirect to authentication page if token doesn't exist
    }
};
exports.isAuthenticated = isAuthenticated;
// Middleware to check user role
const role = (req, res, next) => { };
exports.role = role;
// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth'); // Redirect to authentication page if user is not logged in
    }
    else {
        next(); // Move to the next middleware if user is logged in
    }
};
exports.isLoggedIn = isLoggedIn;
// Middleware to authenticate user using JSON Web Token
const authMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization; // Get authorization header
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({
            error: 'Unauthorized'
        }); // Return unauthorized error if authorization header is missing or token is not in proper format
    }
    const token = authHeader.split(' ')[1]; // Extract token from authorization header
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Verify the token and extract payload
        const userId = payload.userId; // Extract user ID from payload
        const email = payload.email; // Extract email from payload
        req.user = { userId, email }; // Set user information in request object
        next(); // Move to the next middleware
    }
    catch (err) {
        console.log(err); // Log error
        return res.status(401).json({
            error: 'Unauthorized'
        }); // Return unauthorized error if token verification fails
    }
});
exports.authMiddleWare = authMiddleWare;
