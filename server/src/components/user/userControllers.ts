import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import cloudinary from '../../config/cloudConfig'
import fs, { lstat, rmSync } from 'fs'
import multer from 'multer'
import { feedback } from '../feedback/feedbackModel'
import { User } from './userModels'
import { isLowercase } from 'validator'
import { AuthPayload } from '../auth/authInterface'

const upload = multer({ dest: 'uploads/' })

const modifyProfilePicture = async (
  req: Request,
  res: Response,
  image: Express.Multer.File | undefined
) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })
  if (!image)
    return res
      .status(400)
      .send({ error: 'Must provide the new profile picture' })

  const userId: string = req.body.id

  if (!isObjectIdOrHexString(userId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  const objectId = new mongoose.Types.ObjectId(userId)

  try {
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    const result = await cloudinary.uploader.upload(image.path, {
      public_id: userId
    })
    const secure_url = result.secure_url
    user.profilePicUrl = secure_url
    await user.save()
    fs.unlink(image.path, err => {
      if (err) {
        console.log(err)
      }
    })
    return res
      .status(200)
      .send({ msg: 'User profile picture updated successfully' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const createFeedback = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const { created_by, description, title } = req.body

  if (!isObjectIdOrHexString(created_by)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(created_by)

  const fdb = { created_by, title, description }

  try {
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    const fb = new feedback(fdb)
    await fb.save()
    return res.status(201).send(fb)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getUserById = async (req: Request, res: Response) => {
  const { userId, email } = req.user as AuthPayload
  try {
    const user = await User.findById(userId)
    res.status(200).json({
      user: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        profilePicUrl: user?.profilePicUrl
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

const getUserByEmail = async (req: Request, res: Response) => {
  const { emailQuery }: { emailQuery: string } = req.body
  try {
    const matchedUsers = await User.find({
      email: { $regex: emailQuery, $options: 'i' }
    })
    if (matchedUsers.length == 0) {
      return res.status(200).json({
        matchedUsers: []
      })
    }
    const formattedUsers = matchedUsers.map(user => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl
      }
    })
    res.status(200).json({
      matchedUsers: formattedUsers
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}
const getUserByLastName = async (req: Request, res: Response) => {
  const { lastNameQuery }: { lastNameQuery: string } = req.body
  try {
    const matchedUsers = await User.find({
      lastName: { $regex: lastNameQuery, $options: 'i' }
    })
    if (matchedUsers.length == 0) {
      return res.status(200).json({
        matchedUsers: []
      })
    }
    const formattedUsers = matchedUsers.map(user => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicUrl: user.profilePicUrl
      }
    })
    res.status(200).json({
      matchedUsers: formattedUsers
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}

const getUser = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: 'unauthorized'
    })
  }
  try {
    console.log(req.user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}

export {
  upload,
  modifyProfilePicture,
  createFeedback,
  getUser,
  getUserByEmail,
  getUserByLastName,
  getUserById
}
