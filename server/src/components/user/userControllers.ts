import {Request, Response } from 'express'
import { User } from './userModels'

const getUser = async (req:Request
    , res:Response)=>{
    if(!req.isAuthenticated()){
       return  res.status(401).json({
            error: 'unauthorized'
        })
    }
    try{
        console.log(req.user)
    }catch(err){
        console.log(err)
        res.status(500).json({
            error : "Internal Server Error"
        })
    }
}
export default getUser