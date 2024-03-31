"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
require("../components/user/userModels");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userModels_1 = require("../components/user/userModels");
dotenv_1.default.config();
const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_ID = process.env.SECRET_ID;
const callbackURL = "http://localhost:3000/auth/google/callback";
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    userModels_1.User.findById(id).then((user) => {
        done(null, user);
    });
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: String(CLIENT_ID),
    clientSecret: String(SECRET_ID),
    callbackURL: String(callbackURL),
    passReqToCallback: true,
    scope: ['email profile']
}, (request, accessToken, refreshToken, profile, done) => {
    //to check if the email ends with @esi.dz
    if (profile.emails && profile.emails.length > 0 && profile.emails[0].value.endsWith('@esi.dz')) {
        userModels_1.User.findOne({ 'googleId': profile.id }).then((user) => {
            if (user) {
                done(null, user);
            }
            else {
                const email = profile.emails.length > 0 ? profile.emails[0].value : '';
                const { firstName, lastName } = getSurnameAndName(profile.displayName);
                const joinDate = getDate();
                const newUser = new userModels_1.User({
                    firstName: firstName,
                    lastName: lastName,
                    googleId: profile.id,
                    email: email,
                    joinDate: Date.now(),
                }).save().then((savedUser) => {
                    done(null, savedUser);
                }).catch(error => {
                    console.error('Error saving user:', error);
                });
            }
        });
    }
    else {
        // Reject authentication for users with email not ending with "@esi.dz"
        return done(null, false, { message: 'Invalid email domain' });
    }
}));
function getSurnameAndName(fullName) {
    const lastIndex = fullName.lastIndexOf(' ');
    const lastName = fullName.substring(0, lastIndex);
    const firstName = fullName.substring(lastIndex + 1);
    return { firstName, lastName };
}
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}
