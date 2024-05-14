import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserInterface } from '../user/userInterface'
import { User } from '../user/userModels'

/**
 * Create JWT token for user authentication.
 * @param user - UserInterface object.
 * @returns JWT token.
 */
const createToken = (user: UserInterface): string => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 30 * 24 * 60 * 60 // Expires in 30 days
    }
  )
}

/**
 * Redirect to the dashboard with user information and token.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
const dashboard = (req: Request, res: Response): void => {
  const user = req.user as UserInterface
  const token = createToken(req.user as UserInterface)
  const formattedUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    role: user.role,
    passwordIsSet: user.password ? true : false
  }

  // Redirect to addPassword route with user information and token
  res.redirect(
    process.env.CLIENT_URL +
      `/addPassword?user=${JSON.stringify(formattedUser)}&userToken=${token}`
  )
}

export { dashboard }
