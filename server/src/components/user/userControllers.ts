import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import cloudinary from '../../config/cloudConfig'
import fs, { lstat, rmSync } from 'fs'
import multer from 'multer'
import { feedback } from '../feedback/feedbackModel'
import { Project } from "../project/projectModels"
import { publicProjectRequest } from "../publicProjectRequest/publicProjectRequestModel"
import { User } from './userModels'
import { isLowercase } from 'validator'
import { AuthPayload } from '../auth/authInterface'

const upload = multer({ dest: 'uploads/' })

const modifyProfilePicture = async (
  req: Request,
  res: Response,
  image: Express.Multer.File | undefined
) => {
  if (!image)
    return res
      .status(400)
      .send({ error: 'Must provide the new profile picture' })

  const { userId } = req.user as AuthPayload

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
      public_id: userId,
      folder: 'profilesPictures'
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
  const { userId } = req.user as AuthPayload
  const { title, description } = req.body
  
  if (!isObjectIdOrHexString(userId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(userId)

  const fdb = { created_by: userId, title, description }

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

const createPublicProjectRequest = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })

  const { projectId } = req.body
  
  if (!isObjectIdOrHexString(projectId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(projectId)

  try {
    const project = await Project.findById(objectId);
    if (!project) {
      return res.status(404).send({ error: "The project of the publication request is not found" });
    }
    const existReq = await publicProjectRequest.findOne({projectId: objectId})
    if (!existReq) {
      const ppr = new publicProjectRequest({ projectId })
      await ppr.save()
      return res.status(201).send(ppr)
    }
    return res.status(400).send({ error: 'Public project request already exists' })
  } catch (error) {
    console.log(error)
    return res.sendStatus( 400)
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

const addFavouriteProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  const { projectId } = req.body
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(projectId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const userObjectId = new mongoose.Types.ObjectId(userId)
  const projectObjectId = new mongoose.Types.ObjectId(projectId)

  try {
      const user = await User.findById(userObjectId)
      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }
      for(const projectObj of user.projects) {
        if (projectObjectId.equals(new mongoose.Types.ObjectId(projectObj.project.toString()))) {
          user.projects[user.projects.indexOf(projectObj)].isFav = true
          await user.save()
          return res.status(200).send({ msg: 'Project added to favourites' })
        }
      }
      return res.status(400).send({ error: 'The user is not a member of the given project' })
  } catch (error) {
      console.log(error)
      return res.sendStatus(400)
  }
}

export {
  upload,
  modifyProfilePicture,
  createFeedback,
  getUser,
  getUserByEmail,
  getUserByLastName,
  getUserById,
  addFavouriteProject,
  createPublicProjectRequest
}

