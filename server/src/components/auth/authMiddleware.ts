import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: Error | null, decodedToken: any) => {
      if (err) {
        console.log(err.message);
        res.redirect('/auth');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/auth');
  } 
};

export const role = (req: Request, res: Response, next: NextFunction)=>{

}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.redirect('/auth');
  } else {
    next();
  }
};