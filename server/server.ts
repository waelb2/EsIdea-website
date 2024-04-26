import express, { Express } from "express";
import dotenv from "dotenv"
import passport from 'passport';
import "./src/config/passport-setup";
import { connectDB } from "./src/config/db";
import session from 'express-session';
import bodyParser from "body-parser"
import cors from "cors";

dotenv.config()

// Configuring the host 
const HOST = process.env.HOST
const PORT = process.env.PORT || 3000
const DB_URI = process.env.DATABASE_URI




const app: Express = express()

// app config

app.use(
  session({
    secret: 'secret_key',
    resave: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false
}));
=======
  })
)
app.use(passport.initialize())
app.use(passport.session())


/////////////////////////////////////// o auth ///////////////////////////////
app.use(
    cors({
        origin: "http://localhost:5174",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    })
);
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
