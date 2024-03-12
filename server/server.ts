import express ,{Express ,Request , Response } from "express";
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { connectDB } from "./src/config/db";

dotenv.config()

// Configuring the host 
const HOST   = process.env.HOST
const PORT   = process.env.PORT || 3000


const app : Express= express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// routes 
import routes from "./routes"

app.use(routes)
const start = async()=>{

try {
    
    await connectDB(String(process.env.DATABASE_URI))
    console.log("DATABASE CONNECTED")

    app.listen(3000,()=>{
         console.log(`Server starting at http://localhost:${PORT}`)
    })

} catch (error) {
    console.log(error) 
}
}


start()