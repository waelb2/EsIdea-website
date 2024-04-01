<<<<<<< HEAD
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { connectDB } from './src/config/db'
=======
import express, { Express } from "express";
import dotenv from "dotenv";
import passport from 'passport';
import "./src/config/passport-setup";
import { connectDB } from "./src/config/db";
import session from 'express-session';
import bodyParser from "body-parser";
import routes from "./routes";
>>>>>>> 95d72a3a662ffa28d3e5d64044a290121de16b23

const app: Express = express();
dotenv.config();

// Configuring the host
<<<<<<< HEAD
const HOST = process.env.HOST
const PORT = process.env.PORT || 3000

const app: Express = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
import routes from './routes'

app.use(routes)
const start = async () => {
  try {
    await connectDB(String(process.env.DATABASE_URI))
    console.log('DATABASE CONNECTED')
    app.listen(PORT, () => {
      console.log(`Server starting at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
=======
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
>>>>>>> 95d72a3a662ffa28d3e5d64044a290121de16b23
