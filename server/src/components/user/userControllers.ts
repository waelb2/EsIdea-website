import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import cloudinary from '../../config/cloudConfig'
import fs, { lstat, rmSync } from 'fs'
import multer from 'multer'
import { feedback } from '../feedback/feedbackModel'
import { Project, ProjectVisibility } from "../project/projectModels"
import { publicProjectRequest } from "../publicProjectRequest/publicProjectRequestModel"
import { User } from './userModels'
import { isLowercase } from 'validator'
import { AuthPayload } from '../auth/authInterface'

const upload = multer({ dest: 'uploads/' })

/** 
 * Modify user profile picture.
 * 
 * @param req Request object.
 * @param res Response object.
 * @param image Profile picture file.
 */
const modifyProfilePicture = async (
  req: Request,
  res: Response,
  image: Express.Multer.File | undefined
) => {
  // Check if image is provided
  if (!image)
    return res
      .status(400)
      .send({ error: 'Must provide the new profile picture' })

  const { userId } = req.user as AuthPayload

  // Check if userId is a valid ObjectId
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

/** 
 * Create feedback.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

  try {
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }
    const { firstName, lastName, profilePicUrl } = user
    const fdb = { created_by: {firstName, lastName, profilePicUrl}, title, description, creationDate: new Date() }
    const fb = new feedback(fdb)
    await fb.save()
    return res.status(201).send(fb)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

/** 
 * Create public project request.
 * 
 * @param req Request object.
 * @param res Response object.
 */
const createPublicProjectRequest = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })

  const { projectId } = req.body
  const { userId } = req.user as AuthPayload
  
  if (!isObjectIdOrHexString(projectId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(projectId)

  try {
    const project = await Project.findById(objectId)
    if (!project) {
      return res.status(404).send({ error: "The project of the publication request is not found" })
    }
    if (!(userId == project.coordinator.toString()))
      return res.status(400).send({ error: "Your are not the coordinator of the project" })
    const existReq = await publicProjectRequest.findOne({projectId: objectId})
    if (!existReq) {
      if (project.visibility === ProjectVisibility.PUBLIC)
        return res.status(400).send({ error: 'The project is already public' })
      const ppr = new publicProjectRequest({ projectId })
      await ppr.save()
      return res.status(201).send(ppr)
    }
    return res.status(400).send({ error: 'Public project request already exists' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

/** 
 * Get user by ID.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

/** 
 * Get user by email.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

/** 
 * Get user by last name.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

/** 
 * Get user details.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

/** 
 * Add project to user's favourites.
 * 
 * @param req Request object.
 * @param res Response object.
 */
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

/** 
 * Get public projects.
 * 
 * @param req Request object.
 * @param res Response object.
 */
const getPublicProjects = async (req: Request, res: Response) => {
  try {
    const publicProjects = await Project.find({ visibility: 'public' })
      .populate({
        path: 'subTopics',
        model: 'Topic'
      })
      .populate({
        path: 'collaborators.member',
        model: 'User'
      })
      .populate({
        path: 'mainTopic',
        model: 'Topic'
      })
      .populate({
        path: 'clubs',
        model: 'Club'
      })
      .populate({
        path: 'events',
        model: 'Event'
      })
      .populate({
        path: 'modules',
        model: 'Module'
      })
      .populate({
        path: 'ideationMethod',
        model: 'IdeationMethod'
      })
      .populate({
        path: 'coordinator',
        model: 'User'
      })

    const publicProjectsStrings = publicProjects.map(project => {
      const {
        title,
        description,
        creationDate,
        visibility,
        collaboratorsCount,
        collaborators,
        mainTopic,
        subTopics,
        clubs,
        modules,
        events,
        thumbnailUrl
      } = project
      const formattedSubTopics = subTopics?.map(topic => {
        return {
          topicId: topic._id,
          topicName: topic.topicName
        }
      })
      const formattedCollaborators = collaborators?.map(collaborator => {
        if (collaborator.member) {
          const { firstName, lastName, email, profilePicUrl } =
            collaborator.member
          return {
            firstName,
            lastName,
            email,
            profilePicUrl
          }
        }
        return null
      })
      const coordinator = {
        firstName: project.coordinator.firstName,
        lastName: project.coordinator.lastName,
        email: project.coordinator.email,
        profilePicUrl: project.coordinator.profilePicUrl
      }
      const formattedProject = {
        projectId: project.id,
        IdeationMethod: project.ideationMethod.methodName,
        ProjectTitle: title,
        Description: description,
        coordinator,
        Visibility: visibility,
        CollaboratorsCount: collaboratorsCount.toString(),
        collaborators: formattedCollaborators,
        MainTopic: mainTopic?.topicName || '',
        MainTopicId: mainTopic?.id,
        SubTopics: formattedSubTopics,
        Clubs: clubs.map(club => club.clubName),
        Modules: modules.map(module => module.moduleName),
        Events: events.map(event => event.eventName),
        ThumbnailUrl: thumbnailUrl,
        joinedDate: creationDate,
        projectStatus: project.status,
        timer: project.timer
      }

      return formattedProject
    })

    res.status(200).json(publicProjectsStrings)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
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
  createPublicProjectRequest,
  getPublicProjects
}