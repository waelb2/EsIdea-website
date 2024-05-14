import { Request, Response, NextFunction } from 'express' // Importing Express types
import bcrypt from 'bcrypt' // Importing bcrypt for password hashing
import passport from 'passport' // Importing passport for authentication
import { User } from '../user/userModels' // Importing User model
import jwt from 'jsonwebtoken' // Importing jsonwebtoken for token generation
import { sendEmail } from '../../config/nodemailer' // Importing function for sending emails
import crypto from 'crypto' // Importing crypto for token hashing
import { UserInterface } from '../user/userInterface' // Importing UserInterface

// Default route handler for authentication
const auth = (req: Request, res: Response) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>') // Sending HTML link for Google authentication
}

// Passport middleware for Google authentication
const authenticate = passport.authenticate('google', {
  scope: ['email profile'],
  prompt: 'select_account'
})

// Passport middleware for handling Google authentication callback
const authenticateCallback = passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/failure'
})

// Failure route handler for Google authentication
const failure = (req: Request, res: Response) => {
  res.status(403).json({
    error: 'You must be an Esi member'
  })
}

// Route handler for logging out
const logout = (req: Request, res: Response) => {
  req.logout(() => {}) // Logging out the user
  res.redirect(process.env.CLIENT_URL + '/login') // Redirecting to login page
}

// Route handler for rendering login page
const login_get = (req: Request, res: Response) => {
  res.send('login_get') // Sending message indicating rendering login page
}

// Function to create JWT token for user
const createToken = (user: UserInterface) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 30 * 24 * 60 * 60 // Token expires in 30 days
    }
  )
}

// Route handler for user login
const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body // Extracting email and password from request body
  try {
    const user = await User.findOne({ email: email }) // Finding user by email
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' }) // Sending error if user not found
    }
    const passwordMatch = await bcrypt.compare(
      String(password),
      String(user!.password) 
    ) // Comparing passwords
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password, try again' }) // Sending error if password is wrong
    }
    const token = createToken(user) // Creating token
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // Setting cookie expiry time
    })

    // Formatting user object
    const formattedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role
    }
    // Sending user and token in response
    return res.status(200).json({ user: formattedUser, userToken: token })
  } catch (err) {
    const errors = handleError(err) // Handling errors
    res.status(500).json({ errors })
  }
}

// Function to add password to user profile
const addPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body // Extracting email and new password
  const salt = await bcrypt.genSalt() // Generating salt
  const hashedPassword = await bcrypt.hash(String(newPassword), salt) // Hashing password
  try {
    const user = await User.findOne({ email: email }) // Finding user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' }) // Sending error if user not found
    }
    user.password = hashedPassword as string // Updating user's password
    user.save() // Saving user
    // Formatting user object
    const formattedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      role: user.role
    }
    const token = createToken(user) // Creating token
    // Sending success response
    return res
      .status(200)
      .json({ message: 'Password Added Successfully', formattedUser, userToken: token })
  } catch (e) {
    const errors = handleError(e) // Handling errors
    return res.status(500).json({ errors })
  }
}

// Function to update user's password
const updatePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword, confirmNewPassword } = req.body // Extracting request body data
  try {
    const user = await User.findOne({ email: email }) // Finding user by email
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email!' }) // Sending error if user not found
    }
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      String(user!.password)
    ) // Comparing passwords
    if (!passwordMatch) {
      return res.status(404).json({ message: 'Wrong Password, try again!' }) // Sending error if password is wrong
    }
    const salt = await bcrypt.genSalt() // Generating salt
    const hashedPassword = await bcrypt.hash(String(newPassword), salt) // Hashing password
    // Updating user's password
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
      ) // Sending error if update fails
    }
    return res.status(200).json({ message: 'Password Added Successfully' }) // Sending success response
  } catch (e) {
    const errors = handleError(e) // Handling errors
    return res.status(400).json({ errors })
  }
}

// Function to send password reset email
const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email // Extracting email from request body
  const user = await User.findOne({ email: email }) // Finding user by email
  if (!user) {
    return res.status(404).json({ message: 'User not found' }) // Sending error if user not found
  }
  const resetToken = user.createResetPasswordToken() // Creating password reset token
  await user.save() // Saving user
  const resetUrl = process.env.CLIENT_URL + `/auth/resetPassword/${resetToken}` // Generating reset URL
  const message = `Please use the link below to reset your password:\n ${resetUrl}\nThis link is valid only for 10 minutes.` // Email message
  try {
    await sendEmail({ // Sending email
      email: user.email,
      subject: 'Esidea',
      message: message
    })
    return res
      .status(200)
      .json({ message: 'Password reset email was sent to you' }) // Sending success response
  } catch (error) {
    console.log(error)
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    user.save()
    return res.status(500).json({
      message:
        'There was an error sending passord reset email. Try again later!'
    }) // Sending error if email sending fails
  }
}

// Function to reset password
const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, confirmNewPassword } = req.body // Extracting request body data
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex') // Generating token hash
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() }
  }) // Finding user by token
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired!' }) // Sending error if token is invalid or expired
  }
  if (!newPassword == confirmNewPassword) {
    return res.status(400).json({ message: 'Error, try again!' }) // Sending error if passwords don't match
  }
  const salt = await bcrypt.genSalt() // Generating salt
  const hashedPassword = await bcrypt.hash(String(newPassword), salt) // Hashing password
  // Updating user's password
  const updateResult = await User.findOneAndUpdate(
    { passwordResetToken: token },
    { $set: { password: hashedPassword } },
    { runValidators: true, new: true }
  )
  if (!updateResult) {
    return res.status(404).json({ message: 'User not found' }) // Sending error if user not found
  }
  user.passwordResetToken = undefined
  user.passwordResetTokenExpires = undefined
  user.save() // Saving user
  const jwt = createToken(user) // Creating token
  res.cookie('token', jwt, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }) // Setting token cookie
  return res.status(200).json({ user }) // Sending success response
}

// Function to handle errors
const handleError = (err: any) => {
  let errors: any = {}
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach((validationError: any) => {
      errors[validationError.path] = validationError.message
    })
  }
  return errors // Returning errors
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
