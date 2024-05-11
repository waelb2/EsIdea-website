import { Request, Response } from 'express'
import { User } from '../user/userModels'
import { Project, ProjectVisibility } from '../project/projectModels'
import { Statistics, banMsg } from './adminInterface'
import { nbVisits24h } from '../../utils/adminUtils'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import { validationResult } from 'express-validator'
import { ClubInterface } from '../club/clubInterface'
import { ModuleInterface } from '../module/moduleInterface'
import { EventInterface } from '../event/eventInterface'
import { Club } from '../club/clubModel'
import { Module } from '../module/moduleModel'
import { Event } from '../event/eventModel'
import { feedback } from '../feedback/feedbackModel'
import { publicProjectRequest } from '../publicProjectRequest/publicProjectRequestModel'
import { IdeationMethod } from '../idea/ideationMethodModel'
import fs from 'fs'

const getStats = async (req: Request, res: Response) => {
  let stats: Statistics = {
    nbUsers: 0,
    nbProjects: [],
    nbVisits24h: 0,
    nbProjects24h: 0
  }

  try {
    //Number of users
    stats.nbUsers = await User.countDocuments()

    //Number of projects per method
    const methods = await IdeationMethod.find()
    for (const method of methods) {
      const nb = await Project.find({
        ideationMethod: method._id
      }).countDocuments()
      stats.nbProjects.push(nb)
    }

    //Number of website visits in the last 24h
    stats.nbVisits24h = await nbVisits24h()

    //Number of the new projects in the last 24h
    const avant24h = new Date(Date.now() - 24 * 3600 * 1000)
    //filtering the projects that were created in the last 24h
    const projects24h = await Project.find({ creationDate: { $gte: avant24h } })
    stats.nbProjects24h = projects24h.length

    return res.status(200).send(stats)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
    return res.status(200).send(users)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const userId: string = req.body.id

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
    for (const projectObj of user.projects) {
      const project = await Project.findById(new mongoose.Types.ObjectId(projectObj.project._id.toString()))
      if (project) {
        const updatedCollaborators = project.collaborators.filter(
          collaborator => collaborator.member._id.toString() !== userId
        )
        project.collaborators = updatedCollaborators
        await project.save()
      } else {
        return res.status(404).send({ error: 'Project of the user not found' })
      }
    }
    await User.deleteOne(objectId)
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const banUser = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const userId: string = req.body.id
  const duration: number = req.body.duration

  if (duration <= 0)
    return res.status(400).send({
      error: 'Bad duration: must be positive different from 0 integer'
    })
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
    const endDate: Date = new Date(Date.now() + duration * 24 * 3600 * 1000)
    user.ban.isBan = true
    user.ban.banEnd = endDate
    await user.save()
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const unbanUser = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

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
    if (user.ban.isBan) {
      if (Date.now() >= user.ban.banEnd.getTime()) {
        user.ban.isBan = false
        await user.save()
        return res.sendStatus(200)
      }
      return res.status(403).send({ error: banMsg })
    }
    return res.status(400).send({ error: 'User is not banned' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const forceUnbanUser = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

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
    if (user.ban.isBan) {
      user.ban.isBan = false
      await user.save()
      return res.sendStatus(200)
    }
    return res.status(400).send({ error: 'User is not banned' })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getTags = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const type: string = req.query.type as string;
  let docs: (ClubInterface | ModuleInterface | EventInterface)[]
  try {
    switch (type.toLowerCase()) {
      case 'club':
        docs = await Club.find({})
        break
      case 'module':
        docs = await Module.find({})
        break
      case 'event':
        docs = await Event.find({})
        break
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }
    return res.status(200).send(docs)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const createTag = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const { type, ...tag } = req.body
  let savedDoc: ClubInterface | ModuleInterface | EventInterface

  try {
    switch (type.toLowerCase()) {
      case 'club':
        const newClub = new Club(tag)
        savedDoc = await newClub.save()
        break
      case 'module':
        const newModule = new Module(tag)
        savedDoc = await newModule.save()
        break
      case 'event':
        const newEvent = new Event(tag)
        savedDoc = await newEvent.save()
        break
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }
    return res.status(201).send({ msg: 'Created successfully', savedDoc })
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

const deleteTag = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const id: string = req.body.id,
    type: string = req.body.type

  if (!isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(id)

  try {
    switch (type.toLowerCase()) {
      case 'club':
        const club = await Club.findById(objectId)
        if (!club) {
          return res.status(404).send({ error: 'Club not found' })
        }
        await Club.deleteOne(objectId)
        break
      case 'module':
        const module = await Module.findById(objectId)
        if (!module) {
          return res.status(404).send({ error: 'Module not found' })
        }
        await Module.deleteOne(objectId)
        break
      case 'event':
        const event = await Event.findById(objectId)
        if (!event) {
          return res.status(404).send({ error: 'Event not found' })
        }
        await Event.deleteOne(objectId)
        break
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const modifyTag = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })
  const { id, type, tag } = req.body
  if (!isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = mongoose.Types.ObjectId.createFromHexString(id);
  try {
    switch (type.toLowerCase()) {
      case 'club':
        let club = await Club.findById(objectId)
        if (!club) {
          return res.status(404).send({ error: 'Club not found' })
        }
        if (tag.clubName) club.clubName = tag.clubName
        if (tag.description)
          club.description = { ...club.description, ...tag.description }
        await club.save()
        break

      case 'module':
        const module = await Module.findById(objectId)
        if (!module) {
          return res.status(404).send({ error: 'Module not found' })
        }
        if (tag.moduleName) module.moduleName = tag.moduleName
        if (tag.description)
          module.description = {...module.description,...tag.description }
        await module.save()
        break

      case 'event':
        let event = await Event.findById(objectId)
        if (!event) {
          return res.status(404).send({ error: 'Event not found' })
        }
        if (tag.eventName) event.eventName = tag.eventName
        if (tag.description) event.description = tag.description
        await event.save()
        break

      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const fbs = await feedback.find({})
    return res.status(200).send(fbs)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getPublicProjectRequests = async (req: Request, res: Response) => {
  try {
    const ppRequests = await publicProjectRequest.find({})
      .populate({
        path: 'projectId',
        populate: {
          path: 'coordinator',
          model: 'User'
        }
      })
    return res.status(200).send(ppRequests)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

// Needs some discussion, 'cause the admin should approve the public project based on certain verifications (file uploaded)
const approvePublicProjectRequest = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  const pprId: string = req.body.id

  if (!isObjectIdOrHexString(pprId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  const pprObjectId = new mongoose.Types.ObjectId(pprId)

  try {
    const ppr = await publicProjectRequest.findById(pprObjectId)
    if (!ppr) {
      return res
        .status(404)
        .send({ error: 'Project publication request not found' })
    }
    const project = await Project.findById(ppr.projectId)
    if (!project) {
      return res
        .status(404)
        .send({ error: 'The project of the publication request not found' })
    }
    project.visibility = ProjectVisibility.PUBLIC
    await project.save()
    await publicProjectRequest.deleteOne(pprObjectId)
    return res.status(200).send({ msg: "The public project request has been approved" })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getLogs = (req: Request, res: Response) => {
  fs.readFile("./access.log", 'utf8', (error, data) => {
    if (error) {
      console.log(error)
      return res.status(500).send({ error: 'Error in reading logs file' })
    }
    const lines: string[] = data.split('\n')
    
    const parsedLogs: {date: Date, requestType: string, route: string}[] = []

    lines.forEach((line) => {
        // Split the line to extract date, request type, and route
        if(line) {
          const [date, requestInfo] = line.split(' - ')
          const [requestType, route] = requestInfo.split(' ')

          // Create an object for the log entry
          const logEntry = {
              date: new Date(date.trim()),
              requestType: requestType.trim(),
              route: route.trim()
          }
          // Push the object to the array
          parsedLogs.push(logEntry)
        }
    })
    return res.status(200).send(parsedLogs)
  })
}

const deleteLogs = (req: Request, res: Response) => {
  fs.writeFile("./access.log", '', (error) => {
    if (error) {
        return res.status(500).send({ msg: 'Error deleting file content', error })
    }
    return res.sendStatus(200)
  })
}

export {
  getStats,
  getUsers,
  deleteUser,
  banUser,
  unbanUser,
  forceUnbanUser,
  getTags,
  createTag,
  deleteTag,
  modifyTag,
  getFeedbacks,
  getPublicProjectRequests,
  approvePublicProjectRequest,
  getLogs,
  deleteLogs
}