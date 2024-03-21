import passport from 'passport';

import dotenv from "dotenv"

import '../components/user/userModels';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import {User} from '../components/user/userModels';
import { get } from 'http';

dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID

const callbackURL = "http://localhost:3000/auth/google/callback"


passport.serializeUser((user :any,done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:String(CLIENT_ID),
    clientSecret:String(SECRET_ID),
    callbackURL: String(callbackURL),
    passReqToCallback: true,
    scope: ['email profile']
},
    (request, accessToken, refreshToken, profile, done) => {
        //to check if the email ends with @esi.dz
        if (profile.emails && profile.emails.length > 0 && profile.emails[0].value.endsWith('@esi.dz')) {
            
            User.findOne({ 'googleId': profile.id }).then((user) => {
                if (user) {
                    console.log(
                        "The user is already in db:" + user
                    );
                    done(null, user);
                } else {
                    const email = profile.emails!.length > 0 ? profile.emails![0].value : '';

                    const {firstName,lastName} = getSurnameAndName(profile.displayName);
                    
                    const joinDate= getDate();

                    const newUser = new User({
                        firstName:firstName,
                        lastName: lastName,
                        googleId: profile.id,
                        email :email,
                        joinDate: joinDate,
                    }).save().then((savedUser) => {
                        console.log("The user is saved successfully:" + savedUser);
                        done(null, savedUser);
                    }).catch(error => {
                        console.error('Error saving user:', error);
                    });
                }
            })
        } else {
            // Reject authentication for users with email not ending with "@esi.dz"
            return done(null, false, { message: 'Invalid email domain' });
        }

    }
));

function getSurnameAndName(fullName: string): { firstName: string,lastName: string } {
    const lastIndex = fullName.lastIndexOf(' ');
    const lastName = fullName.substring(0, lastIndex);
    const firstName = fullName.substring(lastIndex + 1);
    return {  firstName,lastName };
}
function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
}