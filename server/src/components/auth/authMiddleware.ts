import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthPayload } from './authInterface'
import { UserRole } from '../user/userModels'
import { UserInterface } from '../user/userInterface'
dotenv.config()

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.cookies.jwt

  // check json web token exists & is verified
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: Error | null, decodedToken: any) => {
        if (err) {
          console.log(err.message)
          res.redirect('/auth')
        } else {
          console.log(decodedToken)
          next()
        }
      }
    )
  } else {
    res.redirect('/auth')
  }
}

export const role = (req: Request, res: Response, next: NextFunction) => { }

export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.redirect('/auth')
  } else {
    next()
  }
}

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }
  const token: string = authHeader.split(' ')[1]
  try {
    const payload: AuthPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload

    const userId = payload.userId
    const email = payload.email
    req.user = { userId, email }
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      error: 'Unauthorized'
    })
  }
}


export function verifyToken(req: Request, res: Response, next: NextFunction,) {
  const token = req.cookies.token as string;
  if (!token) {
    return res.status(403).send('Token is not provided');
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    req.user = decoded;
    next();
  });
}

// Middleware to authorize access based on user role
export function authorize(roles: UserRole[]) {
  return (req: Request,
    res: Response,
    next: NextFunction) => {
    const user = req.user! as UserInterface;
    if (user && roles.includes(user.role as UserRole)) {
      next();
    } else {
      return res.status(403).send('Forbidden');
    }
  };
}