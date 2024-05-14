import { Request, Response, NextFunction } from 'express'

import bcrypt from 'bcrypt'
import passport from 'passport'
import { User } from '../user/userModels'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../config/nodemailer'
import crypto from 'crypto'
import { UserInterface } from '../user/userInterface'
const auth = (req: Request, res: Response) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>')
}

//////////////////////////////// google auth //////////////////////////////////////

const authenticate = passport.authenticate('google', {
  scope: ['email profile'],
  prompt: 'select_account'
})

const authenticateCallback = passport.authenticate('google', {
  // successRedirect: 'http://localhost:5174/addPassword',
  successRedirect: '/dashboard',
  failureRedirect: '/auth/failure'
})

const failure = (req: Request, res: Response) => {
  res.status(403).json({
    error: 'You must be an Esi member'
  })
}
const logout = (req: Request, res: Response) => {
  req.logout(() => {})
  res.redirect(process.env.CLIENT_URL + '/login')
}
//////////////////////////////// google auth //////////////////////////////////////

const login_get = (req: Request, res: Response) => {
  res.send('login_get')
}

const createToken = (user: UserInterface) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 30 * 24 * 60 * 60
    }
  )
}
const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email }) // no validation !
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' })
    }
    const passwordMatch = await bcrypt.compare(
      String(password),
      String(user!.password)
    )
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password, try again' })
    }
    const token = createToken(user)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const formattedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role
    }
    return res.status(200).json({ user: formattedUser, userToken: token })
  } catch (err) {
    const errors = handleError(err)
    res.status(500).json({ errors })
  }
}

//////////////////////////////////////////////////////////////////////////
const addPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(String(newPassword), salt)
  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.password = hashedPassword as string
    user.save()

    const formattedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role
    }

    const token = createToken(user)

    return res
      .status(200)
      .json({ message: 'Password Added Successfully', formattedUser, userToken: token })
  } catch (e) {
    const errors = handleError(e)
    return res.status(500).json({ errors })
  }
}

//////////////////////////////////////////////////////////////////////////

const updatePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword, confirmNewPassword } = req.body

  try {
    const user = await User.findOne({ email: email }) // no validation !
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email!' })
    }
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      String(user!.password)
    )

    if (!passwordMatch) {
      return res.status(404).json({ message: 'Wrong Password, try again!' })
    }
    // if (newPassword != confirmNewPassword){
    //     return res.status(404).json({ message: "Please confirm your new password!" });
    // }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(String(newPassword), salt)

    const updateResult = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { runValidators: true, new: true }
    )
    if (!updateResult) {
      return (
        res
          .status(404)
          .json({ message: 'Failed to update password, try again!' })
      )
    }
    return res.status(200).json({ message: 'Password Added Successfully' })
  } catch (e) {
    const errors = handleError(e)
    return res.status(400).json({ errors })
  }
}

//////////////////////////////////////////////////////////////////////////

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const resetToken = user.createResetPasswordToken()

  await user.save()

  //const resetUrl = `${req.protocol}://${req.get("host")}/auth/resetPassword/${resetToken}`;
  const resetUrl = process.env.CLIENT_URL + `/auth/resetPassword/${resetToken}`
  const message = `Please use the link below to reset your password:\n ${resetUrl}\nThis link is valid only for 10 minutes.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Esidea',
      message: message
    })

    return res
      .status(200)
      .json({ message: 'Password reset email was sent to you' })
  } catch (error) {
    console.log(error)
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    user.save()
    return res.status(500).json({
      message:
        'There was an error sending passord reset email. Try again later!'
    })
  }
}
///////////////////////////////////////////////////////////////////////////
const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmNewPassword } = req.body
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() }
  })
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired!' })
  }
  if (!newPassword == confirmNewPassword) {
    return res.status(400).json({ message: 'Error, try again!' })
  }

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(String(newPassword), salt)

  const updateResult = await User.findOneAndUpdate(
    { passwordResetToken: token },
    { $set: { password: hashedPassword } },
    { runValidators: true, new: true }
  )

  if (!updateResult) {
    return res.status(404).json({ message: 'User not found' })
  }
  console.log('done3')

  user.passwordResetToken = undefined
  user.passwordResetTokenExpires = undefined
  user.save()
  const jwt = createToken(user)
  res.cookie('token', jwt, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

  return res.status(200).json({ user })
}

const handleError = (err: any) => {
  let errors: any = {}
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach((validationError: any) => {
      errors[validationError.path] = validationError.message
    })
  }
  return errors
}

export {
  login_get,
  login_post,
  auth,
  authenticate,
  authenticateCallback,
  logout,
  failure,
  addPassword,
  updatePassword,
  forgetPassword,
  resetPassword
}
