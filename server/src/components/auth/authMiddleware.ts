const jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'esideaisthegoat', (err: Error, decodedToken: any) => {
      if (err) {
        console.log(err.message)
        res.redirect('/auth')
      } else {
        console.log(decodedToken)
        next()
      }
    })
  } else {
    res.redirect('/auth')
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect('/auth')
  } else {
    next()
  }
}

module.exports = { requireAuth, isLoggedIn }
