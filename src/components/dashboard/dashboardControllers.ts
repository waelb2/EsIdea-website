
import { Request, Response, NextFunction } from 'express';

const dashboard= (req:Request,res:Response)=>{
    if (req.user){
        return res.status(200).json(req.user);
    }
};

export {dashboard};