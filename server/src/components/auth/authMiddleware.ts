import { Request, Response, NextFunction } from 'express' // Importing necessary types from Express
import jwt, { JwtPayload } from 'jsonwebtoken' // Importing jwt and JwtPayload types from jsonwebtoken
import dotenv from 'dotenv' // Importing dotenv for environment variables
import { AuthPayload } from './authInterface' // Importing AuthPayload interface from authInterface

dotenv.config() // Configuring dotenv to read environment variables

// Middleware to check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.cookies.jwt // Getting JWT token from cookies

  // Check if token exists
  if (token) {
    // Verify the token
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: Error | null, decodedToken: any) => {
        if (err) {
          console.log(err.message) // Log error message
          res.redirect('/auth') // Redirect to authentication page if token verification fails
        } else {
          console.log(decodedToken) // Log decoded token
          next() // Move to the next middleware if token is verified
        }
      }
    )
  } else {
    res.redirect('/auth') // Redirect to authentication page if token doesn't exist
  }
}

// Middleware to check user role
export const role = (req: Request, res: Response, next: NextFunction) => {}

// Middleware to check if user is logged in
export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.redirect('/auth') // Redirect to authentication page if user is not logged in
  } else {
    next() // Move to the next middleware if user is logged in
  }
}

// Middleware to authenticate user using JSON Web Token
export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization // Get authorization header
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      error: 'Unauthorized'
    }) // Return unauthorized error if authorization header is missing or token is not in proper format
  }
  const token: string = authHeader.split(' ')[1] // Extract token from authorization header
  try {
    const payload: AuthPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload // Verify the token and extract payload
    const userId = payload.userId // Extract user ID from payload
    const email = payload.email // Extract email from payload
    req.user = { userId, email } // Set user information in request object
    next() // Move to the next middleware
  } catch (err) {
    console.log(err) // Log error
    return res.status(401).json({
      error: 'Unauthorized'
    }) // Return unauthorized error if token verification fails
  }
}
