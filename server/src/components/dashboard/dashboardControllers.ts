
import { Request, Response, NextFunction } from 'express';

const profile= (req:Request,res:Response)=>{
    res.send(req.user);
};

const isLoggedIn= (req:Request,res:Response,next:NextFunction)=>{
    if (!req.user){
      res.redirect('/auth');
    }else {
      next();
    }
}

export {profile,isLoggedIn};