import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserInterface } from '../user/userInterface'
import { User } from '../user/userModels'

const createToken = (user: UserInterface) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 30 * 24 * 60 * 60
    }
  )
}

const dashboard = (req: Request, res: Response) => {
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

  res.redirect(
    `http://localhost:5174/addPassword?user=${JSON.stringify(
      formattedUser
    )}&userToken=${token}`
  )
}

export { dashboard }
