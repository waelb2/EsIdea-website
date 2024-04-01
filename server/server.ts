import express, { Express } from "express";
import dotenv from "dotenv";
import passport from 'passport';
import "./src/config/passport-setup";
import { connectDB } from "./src/config/db";
import session from 'express-session';
import bodyParser from "body-parser";
import routes from "./routes";

const app: Express = express();
dotenv.config();

// Configuring the host
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'secret_key',
    resave: false,
    cookie :{secure:false,maxAge:30*24*60*60*1000},
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

const start = async () => {
    try {
        await connectDB(String(process.env.DATABASE_URI));
        console.log("DATABASE CONNECTED");
        
        app.listen(PORT, () => {
            console.log(`Server starting at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
